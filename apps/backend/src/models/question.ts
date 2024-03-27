import mongoose from 'mongoose';

interface QuestionDocument extends mongoose.Document {
    questionText: string;
    answer: string;
    author: mongoose.Types.ObjectId;
}

const questionSchema = new mongoose.Schema<QuestionDocument>({
    questionText: { type: String, required: true },
    answer: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Question = mongoose.model<QuestionDocument>('Question', questionSchema);

export default Question;
