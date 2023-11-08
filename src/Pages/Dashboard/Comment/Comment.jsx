import "./Comment.css";

export default function Comment() {
  return (
    <div className="comment-section">
      <template className="reply-input-template" />
      <template className="comment-template" />
      <main>
        <div className="comment-section">
          <div className="comments-wrp">
            <div className="comment-wrp">
              <div className="comment container">
                <div className="c-score">
                  <img
                    src="../../assets/img/icon-plus.svg"
                    alt="plus"
                    className="score-control score-plus"
                  />
                  <p className="score-number">12</p>
                  <img
                    src="../../assets/img/icon-minus.svg"
                    alt="minus"
                    className="score-control score-minus"
                  />
                </div>
                <div className="c-controls">
                  <span className="delete">
                    <img
                      src="../../assets/img/icon-delete.svg"
                      alt=""
                      className="control-icon"
                    />
                    Delete
                  </span>
                  <span className="edit">
                    <img
                      src="../../assets/img/icon-edit.svg"
                      alt=""
                      className="control-icon"
                    />
                    Edit
                  </span>
                  <span className="reply">
                    <img
                      src="../../assets/img/icon-reply.svg"
                      alt=""
                      className="control-icon"
                    />
                    Reply
                  </span>
                </div>
                <div className="c-user">
                  <img
                    src="../../assets/img/avatars/image-amyrobson.webp"
                    alt=""
                    className="usr-img"
                  />
                  <p className="usr-name">amyrobson</p>
                  <p className="cmnt-at">1 month ago</p>
                </div>
                <p className="c-text">
                  <span className="reply-to" />
                  <span className="c-body">
                    Impressive! Though it seems the drag feature could be
                    improved. But overall it looks incredible. You've nailed the
                    design and the responsiveness at various breakpoints works
                    really well.
                  </span>
                </p>
              </div>
              {/*comment*/}
              <div className="replies comments-wrp" />
              {/*replies*/}
            </div>
            <div className="comment-wrp">
              <div className="comment container">
                <div className="c-score">
                  <img
                    src="../../assets/img/icon-plus.svg"
                    alt="plus"
                    className="score-control score-plus"
                  />
                  <p className="score-number">5</p>
                  <img
                    src="../../assets/img/icon-minus.svg"
                    alt="minus"
                    className="score-control score-minus"
                  />
                </div>
                <div className="c-controls">
                  <span className="delete">
                    <img
                      src="../../assets/img/icon-delete.svg"
                      alt=""
                      className="control-icon"
                    />
                    Delete
                  </span>
                  <span className="edit">
                    <img
                      src="../../assets/img/icon-edit.svg"
                      alt=""
                      className="control-icon"
                    />
                    Edit
                  </span>
                  <span className="reply">
                    <img
                      src="../../assets/img/icon-reply.svg"
                      alt=""
                      className="control-icon"
                    />
                    Reply
                  </span>
                </div>
                <div className="c-user">
                  <img
                    src="../../assets/img/avatars/image-maxblagun.webp"
                    alt=""
                    className="usr-img"
                  />
                  <p className="usr-name">maxblagun</p>
                  <p className="cmnt-at">2 weeks ago</p>
                </div>
                <p className="c-text">
                  <span className="reply-to" />
                  <span className="c-body">
                    Woah, your project looks awesome! How long have you been
                    coding for? I'm still new, but think I want to dive into
                    React as well soon. Perhaps you can give me an insight on
                    where I can learn React? Thanks!
                  </span>
                </p>
              </div>
              {/*comment*/}
              <div className="replies comments-wrp">
                <div className="comment-wrp">
                  <div className="comment container">
                    <div className="c-score">
                      <img
                        src="../../assets/img/icon-plus.svg"
                        alt="plus"
                        className="score-control score-plus"
                      />
                      <p className="score-number">4</p>
                      <img
                        src="../../assets/img/icon-minus.svg"
                        alt="minus"
                        className="score-control score-minus"
                      />
                    </div>
                    <div className="c-controls">
                      <span className="delete">
                        <img
                          src="../../assets/img/icon-delete.svg"
                          alt=""
                          className="control-icon"
                        />
                        Delete
                      </span>
                      <span className="edit">
                        <img
                          src="../../assets/img/icon-edit.svg"
                          alt=""
                          className="control-icon"
                        />
                        Edit
                      </span>
                      <span className="reply">
                        <img
                          src="../../assets/img/icon-reply.svg"
                          alt=""
                          className="control-icon"
                        />
                        Reply
                      </span>
                    </div>
                    <div className="c-user">
                      <img
                        src="../../assets/img/avatars/image-ramsesmiron.webp"
                        alt=""
                        className="usr-img"
                      />
                      <p className="usr-name">ramsesmiron</p>
                      <p className="cmnt-at">1 week ago</p>
                    </div>
                    <p className="c-text">
                      <span className="reply-to">@maxblagun</span>
                      <span className="c-body">
                        If you're still new, I'd recommend focusing on the
                        fundamentals of HTML, CSS, and JS before considering
                        React. It's very tempting to jump ahead but lay a solid
                        foundation first.
                      </span>
                    </p>
                  </div>
                  {/*comment*/}
                  <div className="replies comments-wrp" />
                  {/*replies*/}
                </div>
                <div className="comment-wrp">
                  <div className="comment container this-user">
                    <div className="c-score">
                      <img
                        src="../../assets/img/icon-plus.svg"
                        alt="plus"
                        className="score-control score-plus"
                      />
                      <p className="score-number">2</p>
                      <img
                        src="../../assets/img/icon-minus.svg"
                        alt="minus"
                        className="score-control score-minus"
                      />
                    </div>
                    <div className="c-controls">
                      <span className="delete">
                        <img
                          src="../../assets/img/icon-delete.svg"
                          alt=""
                          className="control-icon"
                        />
                        Delete
                      </span>
                      <span className="edit">
                        <img
                          src="../../assets/img/icon-edit.svg"
                          alt=""
                          className="control-icon"
                        />
                        Edit
                      </span>
                      <span className="reply">
                        <img
                          src="../../assets/img/icon-reply.svg"
                          alt=""
                          className="control-icon"
                        />
                        Reply
                      </span>
                    </div>
                    <div className="c-user">
                      <img
                        src="../../assets/img/avatars/image-juliusomo.webp"
                        alt=""
                        className="usr-img"
                      />
                      <p className="usr-name">juliusomo</p>
                      <p className="cmnt-at">2 days ago</p>
                    </div>
                    <p className="c-text">
                      <span className="reply-to">@ramsesmiron</span>
                      <span className="c-body">
                        I couldn't agree more with this. Everything moves so
                        fast and it always seems like everyone knows the newest
                        library/framework. But the fundamentals are what stay
                        constant.
                      </span>
                    </p>
                  </div>
                  {/*comment*/}
                  <div className="replies comments-wrp" />
                  {/*replies*/}
                </div>
              </div>
              {/*replies*/}
            </div>
          </div>
          {/*commentS wrapper*/}
          <div className="reply-input container">
            <img
              src="../../assets/img/avatars/image-juliusomo.webp"
              alt=""
              className="usr-img"
            />
            <textarea
              className="cmnt-input"
              placeholder="Add a comment..."
              defaultValue={""}
            />
            <button className="bu-primary">SEND</button>
          </div>
          {/*reply input*/}
        </div>
        {/*comment sectio*/}
        <div className="modal-wrp invisible">
          <div className="modal container">
            <h3>Delete comment</h3>
            <p>
              Are you sure you want to delete this comment? This will remove the
              comment and cant be undone
            </p>
            <button className="yes">YES,DELETE</button>
            <button className="no">NO,CANCEL</button>
          </div>
        </div>
      </main>
    </div>
  );
}
