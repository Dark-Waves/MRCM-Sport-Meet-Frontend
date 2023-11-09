import "./Top_login.css";
import { top_login } from "../../../data/data";
import { iconsImgs } from "../../../utils/images";

const Top_login = () => {
  return (
    <div className="grid-one-item grid-common grid-c2">
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Top Login</h3>
            <button className="grid-c-title-icon">
                <img src={ iconsImgs.plus } />
            </button>
        </div>

        <div className="grid-content">
            <div className="grid-items">
                {
                    top_login.map((login) => (
                        <div className="grid-item" key = { login.id }>
                            <div className="grid-item-l">
                                <div className="avatar img-fit-cover">
                                    <img src={ login.image } alt="" />
                                </div>
                                <p className="text">{ login.name } <span>{ login.date }</span></p>
                            </div>
                            <div className="grid-item-r">
                                <span className="text-scarlet">{ login.grade }</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Top_login
