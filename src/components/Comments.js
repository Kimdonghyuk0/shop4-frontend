import React, { useEffect, useState } from "react";
import "./../routes/css/Comments.css";
import {
  createComment,
  listComments,
  updateComment,
  deleteComment,
  postLike,
  getLike,
} from "../services/CommentService";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FaCommentSlash } from "react-icons/fa6";

const Comments = ({ goods_id, member_id, canCommentCheck }) => {
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState({});
  const [commentsList, setCommentsList] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [likedComments, setLikedComments] = useState(new Set()); // Store liked comment IDs

  useEffect(() => {
    if (goods_id) {
      listComments(goods_id)
        .then((response) => {
          const sortedComments = response.data.reverse();
          setCommentsList(sortedComments);

          // Fetch like states for the comments if member_id is available
          if (member_id) {
            Promise.all(
              sortedComments.map((comment) =>
                getLike(comment.id, member_id).then((response) => ({
                  id: comment.id,
                  liked: response.data === 1,
                }))
              )
            ).then((likes) => {
              const likedSet = new Set(
                likes.filter((like) => like.liked).map((like) => like.id)
              );
              setLikedComments(likedSet);
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [goods_id, member_id]);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      setNewComment({
        goods: {
          id: goods_id,
        },
        member: {
          id: member_id,
        },
        comment: comment,
        like: 0,
      });
    }
  };

  useEffect(() => {
    if (newComment && newComment.member && newComment.goods) {
      createComment(newComment)
        .then((response) => {
          console.log("Comment added successfully:", response.data);
          setNewComment({});
          return listComments(goods_id);
        })
        .then((response) => {
          const sortedComments = response.data.reverse();
          setCommentsList(sortedComments);
          setComment(""); // Clear the input field
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [newComment, goods_id]);

  const handleEditClick = (id, text) => {
    setEditCommentId(id);
    setEditedText(text);
  };

  const handleEditChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleUpdate = (id) => {
    if (editedText.trim()) {
      updateComment(id, { comment: editedText })
        .then(() => {
          console.log("Comment updated successfully");
          return listComments(goods_id);
        })
        .then((response) => {
          const sortedComments = response.data.reverse();
          setCommentsList(sortedComments);
          setEditCommentId(null);
          setEditedText("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleDelete = (id) => {
    deleteComment(id)
      .then((response) => {
        console.log("Comment deleted successfully:", response.data);
        return listComments(goods_id);
      })
      .then((response) => {
        const sortedComments = response.data.reverse();
        setCommentsList(sortedComments);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLike = (id) => {
    if (!member_id) return; // No action if member_id is not available

    postLike(id, member_id)
      .then((response) => {
        if (response.data === 1) {
          // response.data가 1이면 하트 색칠
          setLikedComments((prev) => new Set(prev.add(id)));
        } else {
          setLikedComments((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
        }
        return listComments(goods_id);
      })
      .then((response) => {
        const sortedComments = response.data.reverse();
        setCommentsList(sortedComments);
      })
      .catch((error) => {
        alert("로그인해주세요");
        console.error(error);
      });
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {commentsList.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">
              <img src="https://via.placeholder.com/40" alt="User Avatar" />
            </div>
            <div className="comment-content">
              <span className="comment-date">
                {comment.modifiedDate == null
                  ? `작성일: ${new Date(comment.createdDate).toLocaleString()}`
                  : `수정일: ${new Date(
                      comment.modifiedDate
                    ).toLocaleString()}`}
              </span>
              <div className="comment-actions">
                {member_id === comment.member.id && (
                  <>
                    <button
                      onClick={() =>
                        handleEditClick(comment.id, comment.comment)
                      }
                    >
                      수정
                    </button>
                    <button onClick={() => handleDelete(comment.id)}>
                      삭제
                    </button>
                  </>
                )}
              </div>
              <div className="comment-username">
                {comment.member.name} {comment.member.age}살{" "}
                {comment.member.gender}자
              </div>
              {editCommentId === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editedText}
                    onChange={handleEditChange}
                    className="comment-input"
                  />
                  <div className="update-actions">
                    <button onClick={() => handleUpdate(comment.id)}>
                      저장
                    </button>
                    <button onClick={() => setEditCommentId(null)}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`like-box ${
                      member_id && likedComments.has(comment.id) ? "liked" : ""
                    }`}
                    onClick={() => member_id && handleLike(comment.id)}
                  >
                    {member_id && likedComments.has(comment.id) ? (
                      <FcLike />
                    ) : (
                      <FaRegHeart />
                    )}{" "}
                    {comment.like}
                  </div>
                  <div className="comment-text">
                    <FaRegComment /> {comment.comment}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {canCommentCheck ? ( // canCommentCheck가 true일 때 댓글 등록 가능
        <div className="comment-form">
          <input
            type="text"
            onChange={handleChange}
            className="comment-input"
            value={comment}
            placeholder="댓글을 입력하세요..."
          />
          <button
            type="submit"
            className="comment-submit-btn"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      ) : (
        <div className="comment-disabled-message">
          <div className="comment-icon">
            <FaCommentSlash />
          </div>
          해당 상품을 구매하셔야 댓글을 달 수 있습니다.
        </div>
      )}
    </div>
  );
};

export default Comments;
