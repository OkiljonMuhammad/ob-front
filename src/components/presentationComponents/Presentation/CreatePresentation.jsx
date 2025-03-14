import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ThemeContext from "../../../context/ThemeContext";
import  useMeasure  from 'react-use-measure';

const CreatePresentation = () => {
  const [title, setTitle] = useState('');
  const [slides, setSlides] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { theme } = useContext(ThemeContext);
  const [slideContainerRef, slideContainerBounds] = useMeasure();
  const [slideViewRef, slideViewBounds] = useMeasure();

  const handleAddSlide = () => {
    setSlides([...slides, { textBlocks: [] }]);
  };

  useEffect(() => {
    handleAddSlide();
  }, []);

  useEffect(() => {
    if (slides.length > 0 && selectedSlideIndex >= slides.length) {
      setSelectedSlideIndex(slides.length - 1);
    }
  }, [slides.length]);
  
  const changeTitle = (event) => {
    const newTitle = event.target.value;
    setTitle(event.target.value);
    return newTitle;
  };

  const handleRemoveSlide = (slideIndex) => {
    if (slides.length == 1) {
      return;
    }
    setSlides((prevSlides) => prevSlides.filter((_, index) => index !== slideIndex));
  };

  const handleAddTextBlock = (slideIndex) => {
  const containerWidth = slideContainerBounds.width || 1200;
  const containerHeight = slideContainerBounds.height || 675;

  const initialX = (50 / containerWidth) * 100;
  const initialY = (50 / containerHeight) * 100;
  const initialWidth = (300 / containerWidth) * 100;
  const initialHeight = (100 / containerHeight) * 100;
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[slideIndex].textBlocks.push({
        content: "",
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      });
      return newSlides;
    });
  };

  const handleTextChange = (slideIndex, textIndex, value) => {
    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) => 
        i === slideIndex 
          ? { 
              ...slide, 
              textBlocks: slide.textBlocks.map((block, j) => 
                j === textIndex ? { ...block, content: value } : block
              ) 
            } 
          : slide
      );
      return newSlides;
    });
  };

  const handleRemoveTextBlock = (slideIndex, textIndex) => {
    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) =>
        i === slideIndex
          ? { ...slide, textBlocks: slide.textBlocks.filter((_, j) => j !== textIndex) }
          : slide
      );
      return newSlides;
    });
  };

  const handleTextBlockDrag = (slideIndex, textIndex, newX, newY) => {
    const containerWidth = slideContainerBounds.width || 1;
    const containerHeight = slideContainerBounds.height || 1;

    const xPercent = (newX / containerWidth) * 100;
    const yPercent = (newY / containerHeight) * 100;

    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              textBlocks: slide.textBlocks.map((block, j) =>
                j === textIndex ? { ...block, x: xPercent, y: yPercent } : block
              ),
            }
          : slide
      )
    );
  };

  const handleTextBlockResize = (slideIndex, textIndex, newWidthStr, newHeightStr, newX, newY) => {
    const newWidth = parseInt(newWidthStr, 10);
    const newHeight = parseInt(newHeightStr, 10);

    const containerWidth = slideContainerBounds.width || 1;
    const containerHeight = slideContainerBounds.height || 1;

    const widthPercent = (newWidth / containerWidth) * 100;
    const heightPercent = (newHeight / containerHeight) * 100;
    const xPercent = (newX / containerWidth) * 100;
    const yPercent = (newY / containerHeight) * 100;

    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              textBlocks: slide.textBlocks.map((block, j) =>
                j === textIndex ? { 
                  ...block,   
                  width: widthPercent, 
                  height: heightPercent, 
                  x: xPercent, 
                  y: yPercent  } : block
              ),
            }
          : slide
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(result.source.index, 1);
    updatedSlides.splice(result.destination.index, 0, movedSlide);
    setSlides(updatedSlides);
  };

  const handleCreatePresentation = async () => {
    if (!title.trim()) {
      toast.error("Please, create title!");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/presentation/create`,
        { title, slides },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success("Presentation created successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Presentation creation failed");
      console.error("Error creating presentation:", error);
    }
  };

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');
  
    return (
      <Container fluid className="mt-4">
        <Row className="g-4">
          {/* Left Column - Slide Thumbnails */}
           <Col md={2} className="border-end">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Slides</h5>
            <Button variant="primary" size="sm" onClick={handleAddSlide}>
            <i className="bi bi-plus-lg"></i>
            </Button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="slides">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  style={{ overflowY: 'auto', maxHeight: '90vh' }}
                >
                  {slides?.map((slide, slideIndex) => (
                    <Draggable key={String(slideIndex)} draggableId={String(slideIndex)} index={slideIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`slide-container mb-2 p-2 border ${selectedSlideIndex === slideIndex ? 'border-primary' : ''}`}
                          style={{
                            ...provided.draggableProps.style,
                            transform: provided.draggableProps.style?.transform,
                            cursor: 'pointer',
                            aspectRatio: '16/9',
                            background: 'white',
                          }}
                          onClick={() => setSelectedSlideIndex(slideIndex)}
                        >
                          <div style={{ transform: 'scale(1)', transformOrigin: '0 0', width: '100%', height: '100%', position: 'relative' }}>
                            {slide.textBlocks?.map((block, textIndex) => (
                              <div
                                key={textIndex}
                                style={{
                                  position: 'absolute',
                                  left: `${block.x}%`,
                                  top: `${block.y}%`,
                                  width: `${block.width}%`,
                                  height: `${block.height}%`,
                                  border: '1px solid #ddd',
                                  fontSize: `${4}px`,
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  overflow: 'hidden',
                                }}
                              className={`${theme === 'dark' ? 'text-dark' : 'text-dark'}`}
                              >
                                {block.content}
                              </div>
                            ))}
                          </div>
                            <Button
                              variant="danger"
                              size="sm"
                              className="delete-slide-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSlide(slideIndex);
                              }}
                            >
                            <i className="bi bi-x-lg"></i>
                            </Button>
                          <div className={`${theme === 'dark' ? 'text-dark' : 'text-dark'} position-absolute top-0 start-0 m-1`}>
                            {slideIndex + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
          {/* Middle Column - Editable Slide */}
          <Col md={8} className="border-end">
            <Card ref={slideContainerRef} className="p-3 shadow position-relative" style={{ aspectRatio: '16/9', background: 'white' }}>
              <div className="h-100 block-container">
                {slides[selectedSlideIndex]?.textBlocks?.map((block, textIndex) => (
                  <Rnd
                    key={textIndex}
                    position={{  
                      x: (block.x * slideContainerBounds.width) / 100, 
                      y: (block.y * slideContainerBounds.height) / 100  
                    }}
                    size={{  
                      width: (block.width * slideContainerBounds.width) / 100, 
                      height: (block.height * slideContainerBounds.height) / 100  
                    }}
                    onDragStop={(e, d) => handleTextBlockDrag(selectedSlideIndex, textIndex, d.x, d.y)}
                    onResizeStop={(e, direction, ref, delta, position) =>
                      handleTextBlockResize(
                        selectedSlideIndex,
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
                    style={{ border: "1px solid #ced4da", borderRadius: "0.25rem", position: 'absolute' }}
                  >
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="delete-block-button"
                        onClick={() => handleRemoveTextBlock(selectedSlideIndex, textIndex)}
                      >
                      <i className="bi bi-x-lg"></i>
                      </Button>
                    <Form.Control
                      as="textarea"
                      value={block.content}
                      onChange={(e) => handleTextChange(selectedSlideIndex, textIndex, e.target.value)}
                      placeholder="Enter text"
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        resize: 'none',
                        padding: '0.375rem 0.75rem',
                      }}
                    />
                  </Rnd>
                ))}
                <div className="position-absolute bottom-0 end-0 m-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleAddTextBlock(selectedSlideIndex)}
                  >
                    Add Text Block
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
  
          {/* Right Column - Participants */}
          <Col md={2}>
          <Row className="d-flex justify-content-center">
          <Col sm='auto'>
          <Button
              variant="success"
              size="sm"
              onClick={handleCreatePresentation}
              className="mb-3"
            >
              Create Presentation
            </Button>
            </Col>
          </Row>
          <Row>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Presentation Title</Form.Label>
              <Form.Control 
                type="text" 
                value={title}
                placeholder="Enter presentation title" 
                onChange={changeTitle} 
                required
              />
            </Form.Group>
          </Row>
          </Col>
        </Row>
      </Container>
    );
  };

export default CreatePresentation;