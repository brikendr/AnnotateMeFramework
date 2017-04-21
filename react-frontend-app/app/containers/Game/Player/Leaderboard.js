var React = require('react'),
    PropTypes = React.PropTypes,
    GameHelper = require('../../../utils/GameHelper'),
    assetsDir = require('../../../utils/constatns').assets,
    LeaderboardPlayer = require('../../../components/Game/Extras/LeaderboardPlayer');

var Leaderboard = React.createClass({
    getInitialState: function() {
        return {
            mappedLeaderboard: []

        }
    },
    componentDidMount() {
        require('../../../styles/leaderboard.css');
        GameHelper.getLeaderboard()
         .then(function(response){
             this.mappLeaderboardPlayers(response.resource, function(){
                document.getElementById('you').focus();
             });
         }.bind(this));
        
    },
    mappLeaderboardPlayers(leaderboard, callBack){
        var i = 1,
            selfId = this.props.User.information.id,
            mappedLeaderboard = [];
        //map collocations
        for(var i=0; i< leaderboard.length; i++){
            if(leaderboard[i].id == selfId) {
                mappedLeaderboard.push(<LeaderboardPlayer key={i} rank={i+1} id="you" name={leaderboard[i].username} level={leaderboard[i].Level.name} isSelf={true} wpm={leaderboard[i].Playerstat.current_wps} points={leaderboard[i].points} />);
            } else {
                mappedLeaderboard.push(<LeaderboardPlayer key={i} rank={i+1} name={leaderboard[i].username} level={leaderboard[i].Level.name} wpm={leaderboard[i].Playerstat.current_wps} points={leaderboard[i].points} />);
            }
            
        }
        this.setState({
            mappedLeaderboard: mappedLeaderboard
        });
        callBack()
    },
    render(){
        return (
            <div className="container col-md-11 marginTop2 " >
                <div className="row justify-content-center marginTop5">
                    <div className="col-md-6">
                        <div className="portlet light bordered">
                                <div className="portlet-body">
                                    <div className="tab-content" style={styles.tabContent}>
                                        <div className="tab-pane active" style={styles.tabPane}>
                                            {this.state.mappedLeaderboard}
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
var styles = {
    tabContent:{
        height: '300px',
        width: '100%',
        overflow: 'hidden'
    },
    tabPane: {
        height: '100%',
        width: '100%',
        overflow: 'auto'
    }
}
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