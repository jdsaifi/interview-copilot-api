import { Request, Response } from 'express';
import { Interview } from '../models/interviews_model';
import { AIService } from '../services/ai.service';

export class QuestionsController {
    private aiService: AIService;

    constructor() {
        this.aiService = new AIService();
    }

    generateQuestions = async (req: Request, res: Response) => {
        try {
            const { interviewId } = req.params;

            // Validate interview ID
            if (!interviewId) {
                return res.status(400).json({
                    success: false,
                    message: 'Interview ID is required'
                });
            }

            // Fetch interview details
            const interview = await Interview.findById(interviewId);
            if (!interview) {
                return res.status(404).json({
                    success: false,
                    message: 'Interview not found'
                });
            }

            // Generate questions using AI
            const questions = await this.aiService.generateInterviewQuestions(
                interview
            );

            return res.status(200).json({
                success: true,
                data: {
                    interview_id: interviewId,
                    questions
                }
            });
        } catch (error) {
            console.error('Error in generateQuestions:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to generate interview questions'
            });
        }
    };
}
