var React = require('react'),
    PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets,
    LeaderboardPlayer = require('../../../components/Game/Extras/LeaderboardPlayer');

var Leaderboard = React.createClass({
    componentDidMount() {
        require('../../../styles/leaderboard.css');
    },
    render(){
        return (
            <div className="container col-md-11 marginTop2 " >
                <div className="row justify-content-center marginTop5">
                    <div className="col-md-6">
                        <div className="portlet light bordered">
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active">
                                            <LeaderboardPlayer name="brikendr" level="Newbie" wpm={45} />
                                            <LeaderboardPlayer name="test12" level="I am speed" wpm={45} />
                                            <LeaderboardPlayer name="YOU" level="Celebrity" wpm={45} isSelf={true} />
                                            <LeaderboardPlayer name="user4hello" level="My name's Jeff!" wpm={45} />
                                            <LeaderboardPlayer name="theSpeeTyper" level="Morgan Freeman of Typing" wpm={45} />
                                            <LeaderboardPlayer name="michaelsc" level="Legend" wpm={45} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>

                    
                </div>
            </div>
        );
    }
});

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user, fetchingData: state.game.fetchingData};
};
var mapDispatchToProps = function(dispatch){
    return {
        toggleDataFetching: function() {dispatch(actions.toggleDataFetching())}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Leaderboard);