import { IDocument, Interview } from '../models/interviews_model';
import { ApiError } from '../utils/api_error';
import { AIService } from './ai.service';
import BaseService from './base_service';
import mongoose from 'mongoose';

interface CreateInterviewDto {
    job_title: string;
    job_description?: string;
    interview_duration?: string;
    interview_type?: string;
}

interface GenerateQuestionsDto {
    interview_id: string;
}

interface UpdateInterviewDto {
    job_title: string;
    job_description?: string;
    interview_duration?: string;
    interview_types?: string;
    predefined_questions?: string;
    negative_questions?: string;
    ai_model_description?: string;
    documents?: IDocument[];
}

class InterviewService {
    async getInterviews(userId: string) {
        try {
            const interviews = await Interview.find({ user_id: userId })
                .select(
                    'job_title job_description interview_duration interview_type createdAt'
                )
                .sort({
                    createdAt: -1
                });
            return interviews;
        } catch (error) {
            throw new ApiError({
                httpCode: 400,
                description: 'Failed to get interviews'
            });
        }
    }

    async getInterviewById(interviewId: string) {
        console.log('interview id: ', interviewId);
        try {
            const interview = await Interview.findById(interviewId);
            return interview;
        } catch (error) {
            throw new ApiError({
                httpCode: 400,
                description: 'Failed to get interview'
            });
        }
    }

    async create(data: CreateInterviewDto) {
        try {
            const interview = await Interview.create(data);
            return interview;
        } catch (error) {
            throw new ApiError({
                httpCode: 400,
                description: 'Failed to create interview'
            });
        }
    }

    async update(
        interview_id: string,
        user_id: string,
        data: UpdateInterviewDto
    ) {
        const condition = {
            $and: [{ _id: interview_id }, { user_id: user_id }]
        };
        console.log('condition: ', condition);
        const isOwner = await Interview.countDocuments(condition);

        if (isOwner === 0) {
            throw new ApiError({
                httpCode: 403,
                description: 'You are not the owner of this interview'
            });
        }

        // If there are new documents, use $push to append them
        if (data.documents && data.documents.length > 0) {
            const { documents, ...updateData } = data;
            const interview = await Interview.findOneAndUpdate(
                condition,
                {
                    $set: updateData,
                    $push: { documents: { $each: documents } }
                },
                { new: true }
            );
            return interview;
        }

        // If no new documents, just update other fields
        const interview = await Interview.findOneAndUpdate(condition, data, {
            new: true
        });
        return interview;
    }

    async generateQuestions(data: GenerateQuestionsDto) {
        try {
            const interview = await Interview.findById(data.interview_id);
            if (!interview) {
                throw new ApiError({
                    httpCode: 404,
                    description: 'Interview not found'
                });
            }

            const aiService = new AIService();
            const questions = await aiService.generateInterviewQuestions(
                interview
            );

            await Interview.findByIdAndUpdate(interview._id, {
                $set: { questions: questions }
            });

            console.log('questions: ', questions);

            return questions;
        } catch (error) {
            throw new ApiError({
                httpCode: 400,
                description: 'Failed to generate questions'
            });
        }
    }

    async deleteDocument(
        interviewId: string,
        documentId: string,
        userId: string
    ) {
        try {
            const interview = await Interview.findOne({
                _id: interviewId,
                user_id: userId
            });

            if (!interview) {
                throw new ApiError({
                    httpCode: 404,
                    description: 'Interview not found'
                });
            }

            // Remove the document from the documents array
            interview.documents = interview.documents.filter(
                (doc: IDocument) => doc._id?.toString() !== documentId
            );

            await interview.save();
            return interview;
        } catch (error) {
            console.log('[ERROR] delete document: ', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError({
                httpCode: 400,
                description: 'Failed to delete document'
            });
        }
    }
}

export default InterviewService;
