import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ['Mathematics', 'Physics', 'Chemistry', 'Computers'],
    },
    mcqResults: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      totalQuestions: {
        type: Number,
        default: 5,
      },
      percentage: {
        type: Number,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    codingResults: {
      score: {
        type: Number,
        required: true,
      },
      isCorrect: {
        type: Boolean,
      },
      output: {
        type: String,
      },
      hasError: {
        type: Boolean,
      },
      codingScore: {
        type: Number,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
