import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Modal from './modal';

const fetcher = (url) => axios.get(url).then((res) => res.data);

function Home() {

    const navigate = useNavigate();

    const { data: user, error: userError, mutate: userMutate } = useSWR('/api/account/status', fetcher);

    const { data: questions, error: questionsError, mutate: questionsMutate } = useSWR('/api/questions', fetcher, { refreshInterval: 2000 });

    const [showModal, setShowModal] = useState(false);

    const [newQuestionText, setNewQuestionText] = useState('');

    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleLogout = async () => {

        try {

            await axios.post('/api/account/logout');

            userMutate();

            navigate('/login');

        } catch (logoutError) {

            alert('logout failed');

        }
    };

    const handleAddQuestion = async (e) => {

        e.preventDefault();

        try {

            await axios.post('/api/questions/add', { questionText: newQuestionText });

            setNewQuestionText('');

            questionsMutate();

            setShowModal(false);

        } catch (addQuestionError) {

            alert('could not add question');

        }
    };

    const handleAnswerQuestion = async (questionId, answer) => {

        try {

            await axios.post('/api/questions/answer', { _id: questionId, answer });

            questionsMutate();

        } catch (answerQuestionError) {

            alert('could not submit answer');

        }
    };

    if (userError || questionsError) return <div>Error loading data</div>;

    if (!user || !questions) return <div>Loading...</div>;

    return (
        <div className="home-container">
            <header className="header">
                {user?.isLoggedIn ? (
                    <>
                        <h1 className="username">Hi {user.user.username}</h1>
                        <button className="logout-btn" onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <>
                        <h1 className="username">Welcome to Ed Lite!!</h1>
                        <Link to="/login" className="login-btn">Sign In</Link>
                    </>
                )}
            </header>
            <div className="content">
                <aside className="sidebar">
                    {user?.isLoggedIn && (
                        <button className="add-question-btn" onClick={() => setShowModal(true)}>Add new Question +</button>
                    )}
                    <ul className="question-list">
                        {questions.map((question) => (
                            <li key={question._id} onClick={() => setSelectedQuestion(question)}>
                                {question.questionText}
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="main-view">
                    {selectedQuestion ? (
                        <div className="question-card">
                            <h3>{selectedQuestion.questionText}</h3>
                            <p>Author: {selectedQuestion.author}</p>
                            <p>Answer: {selectedQuestion.answer || 'No answer yet'}</p>
                            {user?.isLoggedIn && (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const answerInput = form.elements.namedItem('answer') as HTMLInputElement;
                                    const answer = answerInput.value;
                                    handleAnswerQuestion(selectedQuestion._id, answer);
                                }}>
                                    <input type="text" name="answer" placeholder="Answer this question" required />
                                    <button type="submit">Submit Answer</button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <p>Please select a question to view their details!</p>
                    )}
                </main>
            </div>
            {showModal && user?.isLoggedIn && (
                <Modal onClose={() => setShowModal(false)}>
                    <form onSubmit={handleAddQuestion} className="question-form">
                        <div className="input-container">
                            <input
                                type="text"
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                placeholder="Enter your question"
                                className="question-input"
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-question-btn">Submit Question</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default Home;



