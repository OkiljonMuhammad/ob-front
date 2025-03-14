import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Card, Spinner, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Rnd } from "react-rnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";
import { username } from "../../../context/AuthContext";
import { decryptData } from "../../../utils/authUtils";
import { encryptData } from '../../../utils/authUtils';
import ThemeContext from '../../../context/ThemeContext';
import  useMeasure  from 'react-use-measure';

const UpdatePresentation = () => {
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const socket = useRef(null);
  const { encryptedData } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [userData, setUserData] = useState({})
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [slideContainerRef, slideContainerBounds] = useMeasure();
  const [slideViewRef, slideViewBounds] = useMeasure();

  let presentationId;
  try {
    presentationId = decryptData(encryptedData);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return <h3>Invalid presentation data</h3>;
  }
  
  useEffect(() => {
    if (slides.length > 0 && selectedSlideIndex >= slides.length) {
      setSelectedSlideIndex(slides.length - 1);
    }
  }, [slides.length]);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/presentation/${presentationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTitle(response.data?.presentation.title);
        setSlides(response.data?.presentation?.Slides);
      } catch (error) {
        toast.error("Failed to load presentation");
        console.error("Error fetching presentation:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/participant/get/${presentationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data?.participant);
      } catch (error) {
        toast.error("Failed to get user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchPresentation();
  }, [presentationId]);

  const handleUpdatePresentation = async () => {
    if (userData.role === 'Viewer') {
      return;
    };
    try {
      await axios.put(
        `${BASE_URL}/api/presentation/${presentationId}`,
        { title, slides },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (error) {
      toast.error("Failed to update presentation");
      console.error("Error updating presentation:", error);
    }
  };

  useEffect(() => {
    if (userData.role !== 'Viewer') {
      const saveTimeout = setTimeout(() => {
        handleUpdatePresentation();
      }, 1000);
  
      return () => clearTimeout(saveTimeout);
    }
  }, [title, slides]);
  
  useEffect(() => {
    socket.current = io(BASE_URL);
    socket.current.emit("join_presentation", {
      presentationId,
      username: username(),
    });
    socket.current.on("participant_update", (participantList) => {
      setParticipants(participantList);
    });

    socket.current.on("presentation_updated", (updatedSlides) => {
      setSlides(updatedSlides);
    });

    socket.current.on("slide_updated", (updatedSlides) => {
      setSlides(updatedSlides);
    });

    socket.current.on("title_updated", (newTitle) => {
      setTitle(newTitle);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [presentationId]);

  const encryptedUrl = (presentationId) => {
    const encryptedText = encryptData(`${presentationId}`);
    return encodeURIComponent(encryptedText);
  };

  const handleAddSlide = () => {
    if (userData.role === 'Viewer' || userData.role === 'Editor') {
      return;
    };
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides, { TextBlocks: [] }];
      socket.current.emit("presentation_updated", newSlides);
      return newSlides;
    });
  };

  const handleRemoveSlide = (index) => {
    if (userData.role === 'Viewer' || userData.role === 'Editor' || slides.length == 1) {
      return;
    };
    setSlides((prevSlides) => {
      const newSlides = prevSlides.filter((_, i) => i !== index);
      socket.current.emit("presentation_updated", newSlides);
      return newSlides;
    });
  };

  const handleAddTextBlock = (slideIndex) => {
    if (userData.role === 'Viewer') {
      return;
    };
    const containerWidth = slideContainerBounds.width || 1200;
    const containerHeight = slideContainerBounds.height || 675;
    const initialX = (50 / containerWidth) * 100;
    const initialY = (50 / containerHeight) * 100;
    const initialWidth = (300 / containerWidth) * 100;
    const initialHeight = (100 / containerHeight) * 100;


    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[slideIndex].TextBlocks.push({
        content: "",
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      });
      socket.current.emit("slide_updated", newSlides);
      return newSlides;
    });
  };

  const handleRemoveTextBlock = (slideIndex, textIndex) => {
    if (userData.role === 'Viewer') {
      return;
    };
    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) =>
        i === slideIndex
          ? { ...slide, TextBlocks: slide.TextBlocks.filter((_, j) => j !== textIndex) }
          : slide
      );
      socket.current.emit("slide_updated", newSlides);
      return newSlides;
    });
  };


  const handleTextChange = (slideIndex, textIndex, value) => {
    if (userData.role === 'Viewer') {
      return;
    };
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
      socket.current.emit("slide_updated", newSlides);
      return newSlides;
    });
  };

  const handleTextBlockDrag = (slideIndex, textIndex, newX, newY) => {
    if (userData.role === 'Viewer') {
      return;
    };
    const containerWidth = slideContainerBounds.width || 1;
    const containerHeight = slideContainerBounds.height || 1;

    const xPercent = (newX / containerWidth) * 100;
    const yPercent = (newY / containerHeight) * 100;

    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              TextBlocks: slide.TextBlocks.map((block, j) =>
              j === textIndex ? { ...block, x: xPercent, y: yPercent } : block
              ),
            }
          : slide
      );
  
      socket.current.emit("slide_updated", newSlides);
      return newSlides;
    });
  };

  const handleTextBlockResize = (slideIndex, textIndex, newWidthStr, newHeightStr, newX, newY) => {
    if (userData.role === 'Viewer') {
      return;
    };
    const newWidth = parseInt(newWidthStr, 10);
    const newHeight = parseInt(newHeightStr, 10);

    const containerWidth = slideContainerBounds.width || 1;
    const containerHeight = slideContainerBounds.height || 1;

    const widthPercent = (newWidth / containerWidth) * 100;
    const heightPercent = (newHeight / containerHeight) * 100;
    const xPercent = (newX / containerWidth) * 100;
    const yPercent = (newY / containerHeight) * 100;


    setSlides((prevSlides) => {
      const newSlides = prevSlides.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              TextBlocks: slide.TextBlocks.map((block, j) =>
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
      socket.current.emit("slide_updated", newSlides);
      return newSlides;
    });
  };

  const onDragEnd = (result) => {
    if (userData.role === 'Viewer') {
      return;
    };
    if (!result.destination) return;
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(result.source.index, 1);
    newSlides.splice(result.destination.index, 0, movedSlide);
    setSlides(newSlides);
    socket.current.emit("presentation_updated", newSlides);
    return newSlides;
  };

  const changeTitle = (event) => {
    if (userData.role === 'Viewer') {
      return;
    };
    const newTitle = event.target.value;
    setTitle(event.target.value);
    socket.current.emit("title_updated", newTitle);
    return newTitle;
  };

  if (loading) {
    return (
      <Container className="d-flex align-items-center">
        <Spinner animation="border" className="d-block mx-auto" />
      </Container>
    )
  }

  const getTextColorClass = () => (theme === 'light' ? 'text-dark' : 'text-white');

  return (
    <Container fluid className="mt-4 min-vh-100">
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
                            {slide.TextBlocks?.map((block, textIndex) => (
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
          <Card ref={slideContainerRef} className="p-3 shadow" style={{ aspectRatio: '16/9', background: 'white' }}>
            <div className="h-100 block-container">
              {slides[selectedSlideIndex]?.TextBlocks?.map((block, textIndex) => (
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
                  style={{ border: "1px solid #ced4da", borderRadius: "0.25rem" }}
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
              variant="info"
              size="sm"
              className="mb-3"
              onClick={() => {
                const encryptedText = encryptedUrl(presentationId);
                navigate(`/presentation/view/${encryptedText}`);
              }}
            >
              Present
            </Button>
          </Col>
          <Form.Group className="mb-3 text-center">
            <Form.Label>Presentation Title</Form.Label>
            <Form.Control 
              type="text" 
              value={title} 
              onChange={changeTitle} 
              disabled={userData.role === 'Viewer'}
            />
            <p className="mt-3 mb-0">Participants: {participants.length}</p>
          </Form.Group>
          <Col sm='auto'>
          <ListGroup>
            {participants?.map((user) => (
              <ListGroup.Item 
              key={user.id}
              className={`bg-${theme} ${getTextColorClass()}`}>
                {user.username}
              </ListGroup.Item>
            ))}
          </ListGroup>
          </Col>
        </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePresentation;