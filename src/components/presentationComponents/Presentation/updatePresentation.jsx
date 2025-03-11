import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Rnd } from "react-rnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const UpdatePresentation = () => {
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/presentation/${presentationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTitle(response.data?.presentation.title);
        setSlides(response.data?.presentation?.Slides);
        console.log(response.data?.presentation?.Slides);
      } catch (error) {
        toast.error("Failed to load presentation");
        console.error("Error fetching presentation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPresentation();
  }, [presentationId]);

  const handleUpdatePresentation = async () => {
    try {
      console.log(slides);
      await axios.put(
        `${BASE_URL}/api/presentation/${presentationId}`,
        { title, slides },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Presentation updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update presentation");
      console.error("Error updating presentation:", error);
    }
  };

  const handleAddSlide = () => {
    setSlides([...slides, { TextBlocks: [] }]);
  };

  const handleRemoveSlide = (index) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleAddTextBlock = (slideIndex) => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[slideIndex].TextBlocks.push({
        content: "",
        x: 50,
        y: 50,
        width: 300,
        height: 100,
      });
      return newSlides;
    });
  };

  const handleRemoveTextBlock = (slideIndex, textIndex) => {
    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) =>
        i === slideIndex
          ? { ...slide, TextBlocks: slide.TextBlocks.filter((_, j) => j !== textIndex) }
          : slide
      );
      return newSlides;
    });
  };


  const handleTextChange = (slideIndex, textIndex, value) => {
    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) => 
        i === slideIndex 
          ? { 
              ...slide, 
              TextBlocks: slide.TextBlocks?.map((block, j) => 
                j === textIndex ? { ...block, content: value } : block
              ) 
            } 
          : slide
      );
      return newSlides;
    });
  };

  const handleTextBlockDrag = (slideIndex, textIndex, newX, newY) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              TextBlocks: slide.TextBlocks.map((block, j) =>
                j === textIndex ? { ...block, x: newX, y: newY } : block
              ),
            }
          : slide
      )
    );
  };

  const handleTextBlockResize = (slideIndex, textIndex, newWidthStr, newHeightStr, newX, newY) => {
    const newWidth = parseInt(newWidthStr, 10);
    const newHeight = parseInt(newHeightStr, 10);

    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              TextBlocks: slide.TextBlocks.map((block, j) =>
                j === textIndex ? { ...block, width: newWidth, height: newHeight, x: newX, y: newY } : block
              ),
            }
          : slide
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSlides = [...slides];
    const [movedSlide] = reorderedSlides.splice(result.source.index, 1);
    reorderedSlides.splice(result.destination.index, 0, movedSlide);
    setSlides(reorderedSlides);
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <Container className="mt-4 min-vh-100">
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4">Update Presentation</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="slides">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {slides?.map((slide, slideIndex) => (
                    <Draggable key={String(slideIndex)} draggableId={String(slideIndex)} index={slideIndex}>
                      {(provided) => (
                        <Card 
                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                        className="mb-3 p-3" style={{minHeight: '400px',  ...provided.draggableProps.style,}}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5>Slide {slideIndex + 1} {slide?.textBlocks}</h5>
                            <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleRemoveSlide(slideIndex)}
                            style={{ position: "absolute",
                              top: "5px",
                              right: "5px",
                              border: "none",
                              background: "transparent",
                              color: "red",
                              fontSize: "1rem",
                              cursor: "pointer",}}
                            >✖</Button>
                          </div>
                          {slide.TextBlocks?.map((block, textIndex) => (
                            <Rnd
                              key={textIndex}
                              position={{ x: block.x, y: block.y }}
                              size={{ width: block.width, height: block.height }}
                              onDragStop={(e, d) => handleTextBlockDrag(slideIndex, textIndex, d.x, d.y)}
                              onResizeStop={(e, direction, ref, delta, position) =>
                              handleTextBlockResize(
                                slideIndex,
                                textIndex,
                                ref.style.width,
                                ref.style.height,
                                position.x,
                                position.y
                              )
                            }
                            bounds="parent"
                            enableResizing={{
                              bottom: true,
                              bottomLeft: true,
                              bottomRight: true,
                              left: true,
                              right: true,
                              top: true,
                              topLeft: true,
                              topRight: true,
                            }}
                            style={{ border: "1px solid #ced4da", borderRadius: "0.25rem" }}
                          >
                            <Col xs="auto">
                              <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleRemoveTextBlock(slideIndex, textIndex)}
                              style={{
                                position: "absolute",
                                top: "-30px",
                                right: "-30px",
                                border: "none",
                                background: "transparent",
                                color: "red",
                                fontSize: "1rem",
                                cursor: "pointer",
                              }}>
                                ✖
                                </Button>
                            </Col>
                            <Form.Control
                              as="textarea"
                              value={block.content}
                              onChange={(e) => handleTextChange(slideIndex, textIndex, e.target.value)}
                              placeholder="Enter text block content"
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                resize: "none",
                                padding: "0.375rem 0.75rem",
                              }}
                              />
                            </Rnd>
                          ))}
                          <Col className="ms-auto">
                            <Button variant="outline-primary" size="sm" onClick={() => handleAddTextBlock(slideIndex)}>
                              Add Text Block
                            </Button>
                          </Col>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Row className="mt-3">
            <Col>
              <Button variant="secondary" onClick={handleAddSlide}>Add Slide</Button>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleUpdatePresentation}>Update Presentation</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default UpdatePresentation;
