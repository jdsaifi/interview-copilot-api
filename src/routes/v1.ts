import { Router } from 'express';
import AuthController from '../controllers/auth_controller';
import validateRequest from '../middlewares/validate';
import { validateLoginSchema } from '../validations/auth_validation';
import {
    validateCreateInterviewSchema,
    validateGetInterviewByIdSchema,
    validateUpdateInterviewSchema,
    validateDeleteDocumentSchema,
    validateUpdateInterviewTranscriptSchema
} from '../validations/interview_validation';
import asyncHandler from '../utils/async_handler';
import InterviewController from '../controllers/interview_controller';
import { authorizeRequest } from '../middlewares/auth';
import { upload } from '../middlewares/file_upload';

const router = Router();

/**
 * auth routes
 * */

// login route
router.post(
    '/auth/login',
    validateRequest(validateLoginSchema),
    asyncHandler(AuthController.login)
);

// logout route
router.post('/auth/logout', asyncHandler(AuthController.logout));

// me route
router.get('/auth/me', authorizeRequest, asyncHandler(AuthController.me));

/**
 * END auth routes
 * */

/**
 * interview routes
 * */

// get interviews route
router.get(
    '/interviews',
    authorizeRequest,
    asyncHandler(InterviewController.getInterviews)
);

// get interview by id route
router.get(
    '/interviews/:interview_id',
    authorizeRequest,
    validateRequest(validateGetInterviewByIdSchema),
    asyncHandler(InterviewController.getInterviewById)
);

// create interview route
router.post(
    '/interviews',
    authorizeRequest,
    upload.array('documents', 5), // Allow up to 5 files with field name 'documents'
    validateRequest(validateCreateInterviewSchema),
    asyncHandler(InterviewController.createInterview)
);

// update interview route
router.put(
    '/interviews/:interview_id',
    authorizeRequest,
    // optionalUpload, // Optional file upload middleware
    upload.array('documents', 5), // Allow up to 5 files with field name 'documents'
    validateRequest(validateUpdateInterviewSchema),
    asyncHandler(InterviewController.updateInterview)
);

// delete interview document route
router.delete(
    '/interviews/:interview_id/documents/:document_id',
    authorizeRequest,
    validateRequest(validateDeleteDocumentSchema),
    asyncHandler(InterviewController.deleteInterviewDocument)
);

// get interview by id route (public)
router.get(
    '/public/interviews/:interview_id',
    // authorizeRequest,
    validateRequest(validateGetInterviewByIdSchema),
    asyncHandler(InterviewController.getInterviewById)
);

// update interview transcript route (public)
router.put(
    '/public/interviews/:interview_id/transcript',
    // authorizeRequest,
    validateRequest(validateUpdateInterviewTranscriptSchema),
    asyncHandler(InterviewController.updateInterviewTranscript)
);

export default router;
