import React, { useEffect, useState, useContext } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from 'react-markdown';
import { decryptData } from "../../utils/authUtils";
import ThemeContext from '../../context/ThemeContext';
import AuthContext from '../../context/AuthContext';


export default function SubmitForm() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const tabName = 'forms';
  const { encryptedData } = useParams();
  const token = localStorage.getItem("token");
  const { theme } = useContext(ThemeContext); 
  const { isAuthenticated } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [template, setTemplate] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  

  let formId, templateId;
  try {
    const decryptedText = decryptData(encryptedData);
    [formId, templateId] = decryptedText.split("/");
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return <h3>Invalid form data</h3>;
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [token]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/question/questions/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    }
  };

  const fetchTemplate = async () => {
    try {
      const url = isAuthenticated
        ? `${BASE_URL}/api/template/${templateId}`
        : `${BASE_URL}/api/template/public/${templateId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` || '',
        },
      });
      const fetchedTemplateData = response.data.template;
      setTemplate(fetchedTemplateData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching template:', error);
      setError(error.response?.data?.message || 'Failed to load template data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
    if (templateId) {
      fetchQuestions()};
  }, [templateId, token]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const closePage = () => {
    navigate(`/dashboard/${tabName}`);
  }
  const submitAnswers = async () => {
    
    const missingAnswers = questions.filter(
      (q) => q.type !== "checkbox" && !answers[q.id]
    );
  
    if (missingAnswers.length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, response]) => ({
        formId: formId,
        questionId: parseInt(questionId),
        userId,
        response,
      }));

      await axios.post(
        `${BASE_URL}/api/answer/create`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Submitted successfully");
      setSubmitted(true);
      navigate(`/dashboard/${tabName}`);
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Failed to submit answers");
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container className="py-4">
      {submitted ? (
        <div className="py-4 d-flex flex-column align-items-center justify-content-center">
        <h2 className="mb-4 text-center">Form Submitted <i className="bi bi-check-circle"></i></h2>
          <Button 
            variant="primary"
            size="lg"
            onClick={closePage}>
            Close
          </Button>
        </div>
      ) : (loading ? (
        <div className="d-flex justify-content-center text-center">
        <div>
          <div className="spinner-grow text-primary"></div>
          <p>Loading questions...</p>
        </div>
      </div>
      ) : questions.length === 0 ? (
          <div className="py-4 d-flex flex-column align-items-center justify-content-center">
          <h2 className="mb-4 text-center">No questions</h2>
            <Button 
              variant="primary"
              size="lg"
              onClick={closePage}>
              Close
            </Button>
          </div>
        ) : (<>
            <h3 className="text-center mt-4 mb-4">Fill Out the Form</h3>
            {template.image.length > 0 && (
              <Row>
                <Col>
                <h5>Image:</h5>
                <img src={template.image} alt='image' className='img-fluid custom-img'></img>
                </Col>
              </Row>
            )}
            <h5>Title: {template.title}</h5>
            {template.description && (
              <h6>
                <ReactMarkdown>
                {`Description: ${template.description}` || "No description provided."}
                </ReactMarkdown>
              </h6>
            )}

          <Form>
            {questions.map((question, index) => (
              <Form.Group key={question.id} className="mb-3">
                <Form.Label>{index + 1}. {question.text}</Form.Label>
                {question.type === "single-line" && (
                  <Form.Control
                    type="text"
                    placeholder="Enter your answer"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required
                    className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                  />
                )}
                {question.type === "multi-line" && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your answer"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required
                    className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                  />
                )}
                {question.type === "integer" && (
                  <Form.Control
                    type="number"
                    placeholder="Enter a number"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required
                    className={`bg-${theme} ${getTextColorClass()} custom-placeholder`}
                  />
                )}
                {question.type === "checkbox" && (
                  <Form.Check
                    type="checkbox"
                    label="Check if applicable"
                    checked={answers[question.id] || false}
                    onChange={(e) => handleChange(question.id, e.target.checked)}
                    className={`bg-${theme} ${getTextColorClass()} custom-label`}
                  />
                )}
              </Form.Group>
            ))}
            <Row className="mt-4">
               <Col xs="auto">
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => navigate(`/dashboard/${tabName}`)}
                >
                  Cancel
                </Button>
                  </Col>
              <Col xs="auto">
                <Button 
                variant="primary" 
                onClick={submitAnswers}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </>)
      )}
    </Container>
  );
}
