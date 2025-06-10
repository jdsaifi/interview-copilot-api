import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import InterviewHandler from '../handlers/interview_handler';
import InterviewService from '../services/interview_service';
import DocumentParser from '../utils/document_parser';
import fs from 'fs';
import { promisify } from 'util';
import { IDocument } from '../models/interviews_model';
import { AIService } from '../services/ai.service';
import Logger from '../utils/logger';

const unlinkAsync = promisify(fs.unlink);

class InterviewController {
    static async getInterviews(req: Request, res: Response) {
        const user = res.locals.user;
        const interviewService = new InterviewService();
        const interviews = await interviewService.getInterviews(user.id);
        return res.success(StatusCodes.OK, interviews);
    }

    static async createInterview(req: Request, res: Response) {
        const user = res.locals.user;
        const body = req.body;

        // Process uploaded files
        const documents = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const { content, parsed_at } =
                    await DocumentParser.parseDocument(file);
                documents.push({
                    filename: file.filename,
                    originalname: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    content,
                    parsed_at
                });
            }
        }

        const data = {
            ...body,
            user_id: user?.id,
            documents
        };

        const interviewService = new InterviewService();
        const interview = await interviewService.create(data);
        if (interview) {
            await interviewService.generateQuestions({
                interview_id: interview._id.toString()
            });
        }
        const response = {
            id: interview._id,
            job_title: interview.job_title,
            interview_duration: interview.interview_duration,
            interview_types: interview.interview_types,
            createdAt: interview?.createdAt
        };
        return res.success(StatusCodes.CREATED, response);
    }

    static async generateQuestions(req: Request, res: Response) {
        const { interview_id } = req.payload.params;
        const interviewService = new InterviewService();
        const interview = await interviewService.generateQuestions(
            interview_id
        );
        return res.success(StatusCodes.OK, interview);
    }

    static async getInterviewById(req: Request, res: Response) {
        const { interview_id } = req.payload.params;
        const interviewService = new InterviewService();
        const interview = await interviewService.getInterviewById(interview_id);
        return res.success(StatusCodes.OK, interview);
    }

    static async updateInterview(req: Request, res: Response) {
        const user = res.locals.user;
        const body = req.payload.body;
        const { interview_id } = req.payload.params;
        console.log('update interview body.files: ', req.files);

        // Process uploaded files
        const data = {
            ...body
        };
        if (req.files) {
            const documents = [];
            for (const file of req.files as Express.Multer.File[]) {
                const { content, parsed_at } =
                    await DocumentParser.parseDocument(file);
                documents.push({
                    filename: file.filename,
                    originalname: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    content,
                    parsed_at
                });
            }

            console.log('update interview documents: ', documents);

            if (documents.length > 0) {
                data.documents = documents;
            }
        }

        console.log('input data: ', data);
        const interviewService = new InterviewService();
        const interview = await interviewService.update(
            interview_id,
            user?.id,
            data
        );
        return res.success(StatusCodes.OK, interview);
    }

    static async deleteInterviewDocument(req: Request, res: Response) {
        const user = res.locals.user;
        const { interview_id, document_id } = req.params;

        // Get the interview to find the document path
        const interviewService = new InterviewService();
        const interview = await interviewService.getInterviewById(interview_id);
        if (!interview) {
            return res.error(StatusCodes.NOT_FOUND, 'Interview not found');
        }

        // Find the document in the interview
        const document = interview.documents.find(
            (doc: IDocument) => doc._id?.toString() === document_id
        );
        if (!document) {
            return res.error(StatusCodes.NOT_FOUND, 'Document not found');
        }

        try {
            // Delete the file from the filesystem
            await unlinkAsync(document.path);

            // Remove the document from the interview
            const updatedInterview = await interviewService.deleteDocument(
                interview_id,
                document_id,
                user.id
            );

            return res.success(StatusCodes.OK, updatedInterview);
        } catch (error) {
            console.error('Error deleting document:', error);
            return res.error(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Failed to delete document'
            );
        }
    }

    static async updateInterviewTranscript(req: Request, res: Response) {
        const { interview_id } = req.payload.params;
        const { transcript } = req.payload.body;

        const data = JSON.parse(transcript);

        const interviewService = new InterviewService();
        const interview = await interviewService.updateTranscript(
            interview_id,
            data
        );

        // save interview feedback by LLM
        const aiService = new AIService();
        const feedback = await aiService.generateInterviewFeedback(transcript);
        interviewService
            .updateLLMFeedback(interview_id, feedback)
            .then(() => {
                Logger.info('interview feedback updated');
            })
            .catch((error) => {
                Logger.error(
                    `error updating interview feedback: ${error.message}`,
                    error
                );
            });
        return res.success(StatusCodes.OK, interview);
    }
}

export default InterviewController;
