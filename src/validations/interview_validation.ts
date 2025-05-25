import { z } from 'zod';

export const validateCreateInterviewSchema = z.object({
    body: z.object({
        job_title: z.string().min(3).max(100).nullable(),
        job_description: z.string().max(5000).optional().nullable(),
        interview_duration: z.string().max(50).optional().nullable(),
        interview_types: z.string().optional().nullable()
    })
});

export const validateGetInterviewByIdSchema = z.object({
    params: z.object({
        interview_id: z.string().min(24).max(24)
    })
});

export const validateUpdateInterviewSchema = z.object({
    body: z.object({
        job_title: z.string().min(3).max(100),
        job_description: z.string().max(5000).optional().nullable(),
        interview_duration: z.string().max(50).optional().nullable(),
        interview_types: z.string().optional().nullable()
        //documents: z.array(z.string()).nullable().optional()
    }),
    params: z.object({
        interview_id: z.string().min(24).max(24)
    })
});

export const validateDeleteDocumentSchema = z.object({
    params: z.object({
        interview_id: z.string().min(24).max(24),
        document_id: z.string().min(24).max(24)
    })
});
