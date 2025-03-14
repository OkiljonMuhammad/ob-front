import React, { useState, useEffect, useCallback } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { decryptData } from "../../../utils/authUtils";
import { useParams } from "react-router-dom";
import axios from "axios";
import Markdown from "react-markdown";

const ViewPresentation = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [presentationData, setPresentationData] = useState({
    title: "",
    creatorId: "",
    slides: [],
  });
  const [loading, setLoading] = useState(false);
  const { encryptedData } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  let presentationId;
  try {
    presentationId = decryptData(encryptedData);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return <h3>Invalid presentation data</h3>;
  }

  const fetchPresentations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/presentation/${presentationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const fetchedPresentationData = response.data.presentation;

      setPresentationData({
        title: fetchedPresentationData.title || "",
        creatorId: fetchedPresentationData.creatorId || "",
        slides:
          fetchedPresentationData.Slides?.map((slide) => ({
            order: slide.order,
            textBlocks:
              slide.TextBlocks?.map((block) => ({
                content: block.content,
                x: block.x,
                y: block.y,
                width: block.width,
                height: block.height,
              })) || [],
          })) || [],
      });
    } catch (error) {
      console.error("Error fetching presentation:", error);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, presentationId]);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

  useEffect(() => {
  }, [presentationData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFullscreen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <Container
      fluid
      className={`p-3 ${isFullscreen ? "fullscreen-mode" : "normal-mode"}`}
      style={{
        position: isFullscreen ? "fixed" : "relative",
        top: 0,
        left: 0,
        width: isFullscreen ? "100vw" : "80vw",
        height: isFullscreen ? "100vh" : "auto",
        backgroundColor: "white",
        overflow: "auto",
        transition: "all 0.3s ease-in-out",
        border: "1px solid #ddd",
        padding: "20px",
        
      }}
    > 
      <div className="presentation-container">
      <Row className="align-items-center justify-content-between header">
        <Col xs='auto'>
          <h3 className="text-center">{presentationData?.title || "Presentation"}</h3>
        </Col>
        <Col xs='auto' className="ms-auto">
          <Button size='sm' onClick={() => setIsFullscreen((prev) => !prev)} className="mt-0 mb-3">
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </Button>
        </Col>
      </Row>
    </div>
      {loading ? (
        <h5>Loading...</h5>
      ) : (
        presentationData?.slides?.map((slide, index) => (
          <div
            key={index}
            className="p-3 border mb-3"
            style={{
              position: "relative",
              width: "auto",
              height: "100vh",
              overflow: "hidden",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h5 className="view-slide-order">Slide {index + 1}</h5>
            {slide.textBlocks.map((block, textIndex) => (
              <div
                key={textIndex}
                style={{
                  position: "absolute",
                  left: `${block.x}%`,
                  top: `${block.y}%`,
                  width: `${block.width * 1.042}%`,
                  height: `${block.height * 1.063}%`,
                  border: "1px solid #aaa",
                  padding: "5px",
                  backgroundColor: "white",
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                }}
              >
                <Markdown>
                {block.content}
                </Markdown>
              </div>
            ))}
          </div>
        ))
      )}
    </Container>
  );
};

export default ViewPresentation;
