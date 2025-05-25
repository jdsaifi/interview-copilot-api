import { Request, Response } from 'express';
import InterviewService from '../services/interview_service';
import { ApiError } from '../utils/api_error';
import { StatusCodes } from 'http-status-codes';

class InterviewHandler {
    // static async getInterviews(req: Request, res: Response) {
    //     const user = res.locals.user;
    //     const interviews = await InterviewService.getInterviews(user.id);
    //     return res.success(StatusCodes.OK, interviews);
    // }
    // static async create(req: Request, res: Response) {
    //     const interview = await InterviewService.create(req.body);
    //     return res.success(StatusCodes.CREATED, interview);
    // }
    // static async generateQuestions(req: Request, res: Response) {
    //     const questions = await InterviewService.generateQuestions(req.body);
    //     return res.success(StatusCodes.OK, questions);
    // }
    // static async getInterviewById(req: Request, res: Response) {
    //     const interview = await InterviewService.getInterviewById(
    //         req.params.interviewId
    //     );
    //     return res.success(StatusCodes.OK, interview);
    // }
}

export default InterviewHandler;
