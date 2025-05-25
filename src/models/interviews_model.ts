import mongoose from 'mongoose';

export interface IDocument {
    _id?: mongoose.Types.ObjectId;
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
    size: number;
    content?: string; // Parsed content of the document
    parsed_at?: Date;
}

interface IInterview {
    job_title: string;
    job_description: string | null;
    interview_duration: number | null;
    interview_types: string | null;
    questions: string[];
    predefined_questions: string | null;
    negative_questions: string | null;
    ai_model_description: string | null;
    documents: IDocument[];
    deleted_at: Date | null;
    deleted_by: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        default: null
    },
    parsed_at: {
        type: Date,
        default: null
    }
});

const interviewSchema = new mongoose.Schema(
    {
        job_title: {
            type: String,
            required: true
        },
        job_description: {
            type: String,
            default: null
        },
        interview_duration: {
            type: Number,
            default: null
        },
        interview_types: {
            type: String,
            default: null
        },
        questions: {
            type: Array,
            default: []
        },
        predefined_questions: {
            type: String,
            default: null
        },
        negative_questions: {
            type: String,
            default: null
        },
        ai_model_description: {
            type: String,
            default: null
        },
        documents: {
            type: [documentSchema],
            default: []
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        deleted_at: {
            type: Date,
            default: null
        },
        deleted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export const Interview = mongoose.model<IInterview>(
    'Interview',
    interviewSchema
);
