var React = require('react');
var PropTypes = React.PropTypes;
var SpaceActionBtn = require('../SpaceActionBtn');

function IntroScreen(props) {
    return ( 
        <div>
            <div className="row justify-content-center animated fadeInRight" style={styles.centerIt}>
                <div className="col-4 text-center">
                    <h4 className="animated fadeInUp">
                        Welcome to Smartype! <br />
                        It's all about typing fast, accurate and solving facts!
                    </h4>
                </div>
            </div>
            <div className="row justify-content-center margin-top-10">
                <div className="col-4 text-center">
                    <h5 className="animated fadeInRight">Let's see how fast you can type shall we?</h5>
                </div>
            </div>
            <SpaceActionBtn command="SPACE" message="Hit SPACE to Continue" divSize={12}/>
        </div>
    );
}

var styles = {
    centerIt: {
        marginTop: '20%'
    },
    disclaimerFooter: {
        display: 'block',
        margin: '0 auto'
    },
    spacebarimg: {

    }
}

IntroScreen.propTypes = {
    onSpaceClick: PropTypes.func.isRequired
}

module.exports = IntroScreen;