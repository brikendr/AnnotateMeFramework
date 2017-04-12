var React = require('react');
var PropTypes = React.PropTypes;
var SpaceActionBtn = require('../SpaceActionBtn');

function PuzzleIntro(props) {
    return ( 
        <div>
            <div className="row justify-content-center animated fadeInDown" style={styles.centerIt}>
                <div className="col- text-center">
                    <img className="display-img-center" src="app/assets/img/puzzle.png" width="10%"/>
                </div>
            </div>
            <div className="row justify-content-center animated fadeInRight margin-top-10">
                <div className="col-4 text-center">
                    <h4 className="animated fadeInUp">
                        Puzzle Time! <br />
                        Use your fast typing skills to reveal a puzzle!
                    </h4>
                    <h5> More <span className="label label-success">bonus points</span> if you are fast and accurate! </h5>
                </div>
            </div>
            <SpaceActionBtn />
        </div>
    );
}

var styles = {
    centerIt: {
        marginTop: '15%'
    }
}

PuzzleIntro.propTypes = {
    onSpaceActionBtn: PropTypes.func.isRequired
}

module.exports = PuzzleIntro;