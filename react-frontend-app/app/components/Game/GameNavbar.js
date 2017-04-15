require('../../styles/hamburgerNav.css');
var React = require('react'),
    PropTypes = React.PropTypes;

function GameNavbar(props) {
    return (
        <header className="page-header " style={{background: 'none'}}>
            <nav className="navbar " role="navigation">
                <div className="container-fluid ">
                    <div className="havbar-header ">
                        <nav className="menu">
                            <input type="checkbox" href="#" className="menu-open" name="menu-open" id="menu-open"/>
                            <label className="menu-open-button" htmlFor="menu-open">
                                <span className="hamburger hamburger-1"></span>
                                <span className="hamburger hamburger-2"></span>
                                <span className="hamburger hamburger-3"></span>
                            </label>
                            
                            <a href="#" className="menu-item"> <i className="fa fa-home"></i> </a>
                            <a href="#" className="menu-item"> <i className="fa fa-user"></i> </a>
                            <a href="#" className="menu-item"> <i className="fa fa-rocket"></i> </a>
                            <a href="#" onClick={props.logoutUser} className="menu-item"> <i className="fa fa-sign-out"></i> </a>
                        </nav>
                    </div>
                </div>
            </nav>
        </header>
    );
}
GameNavbar.propTypes = {
    logoutUser: PropTypes.func.isRequired
}
module.exports = GameNavbar;