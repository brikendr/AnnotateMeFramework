var React = require('react'),
    PropTypes = React.PropTypes,
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    authActions = require('../../redux/actions/authActions'),
    gameActions = require('../../redux/actions/utilActions'),
    CategoryTile = require('../../components/Game/Dashboard/CategoryTile'),
    PlayerGameStats = require('../../components/Game/Dashboard/PlayerGameStats'),
    SpaceActionBtn = require('../../components/Game/SpaceActionBtn'),
    toastr = require('../../assets/js/plugins/bootstrap-toastr/toastr.min.js');

var GameHomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            mappedCategories: [],
            playerStats: null
        }
    },
    propTypes:{
        User: PropTypes.object.isRequired,
        toggleDataFetching: PropTypes.func.isRequired,
        setPlayerStats: PropTypes.func.isRequired
    },
    componentWillMount(){
        require('../../styles/toastr.min.css');

        this.props.toggleDataFetching();
        //Get PlayerStats
        GameHelper.getCategoriesAndPlayerStats(this.props.User.information.id)
        .then(function(response){
            this.mapCategories(response.categories);
            this.props.toggleDataFetching();
            this.setState({playerStats: response.playerStats});
            
            //Store stats in redux store state 
            this.props.setPlayerStats(response.playerStats);
        }.bind(this));
        document.addEventListener("keydown", this.commandListener);

        //Check if any challenge is updated and then notify player
        GameHelper.getUpdatedChallenged(this.props.User.information.id)
         .then(function(response){
            response.resource.forEach(function(element) {
                var status = element.status == 1 ? "success": element.status == 2 ? "error":"warning",
                    message = element.status == 1 ? " won the challenge against ": element.status == 2 ? " lost the challenge against ":" typed with the same speed as ",
                    pointDesc = element.status == 1 ? "<br> Points Won: "+element.challenged_points: element.status == 2 ? "<br> Points Lost: "+element.challenged_points:"<br> Points Shared: "+Math.round(element.challenged_points / 2);
                this.showToastr(
                    "YOU"+message+element.challengee.username + pointDesc,
                    status,
                    "toast-bottom-right");
                
                //After the pushNotifications are shown, update all challanges
                var data = {
                    'status': element.status + 3,
                    'challengeId': element.id,
                    'shouldUpdatePlayerScore': false
                }
                
                GameHelper.updateChallenge(data); 
            }.bind(this));

         }.bind(this));

         //Suggest a warmup
         setTimeout(function(){
            this.showToastr("Warmup your fingers by taking a quick practice. PRESS CTRL+Z to start!", "info","toast-bottom-left");
         }.bind(this), 10000)
    },
    mapCategories(categories) {
        var i = 1;
        const catList = categories.map(category => 
            <CategoryTile key={category.id} progress={category.progress} categoryName={category.name} icon={category.logo_path} keyCode={i++} />
        );

        this.setState({
            mappedCategories: catList
        })
    },
    commandListener(e) {
        if(this.state.mappedCategories[e.keyCode - 49] != null && this.state.mappedCategories[e.keyCode - 49].props.progress == 100) {
            this.alertPlayer();
        }

        if (e.ctrlKey && e.keyCode == 32) {
            //var randomCategory = Math.floor((Math.random() * this.state.mappedCategories.length));
            
            this.redirectGame('play', null);
        } else if(e.ctrlKey && e.keyCode == 90) {
            this.redirectGame('practice');
        } else if (e.keyCode >= 49 && e.keyCode <= 49 + this.state.mappedCategories.length && this.state.mappedCategories[e.keyCode - 49] != null) {
            this.redirectGame('play', this.state.mappedCategories[e.keyCode - 49].key);
        }
    },
    alertPlayer() {
        alert('THE CATEGORY IS COMPLETED, THERE ARE NO MORE ROUNDS IN THIS CATEGORY!');
    },
    redirectGame(path, categoryID) {
        document.removeEventListener("keydown", this.commandListener);
        this.context.router.push({
            pathname: path,
            state: {
                categoryID: categoryID
            }
        });
    },
    showToastr(message, status, position) {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "positionClass": position,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "20000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr[status](message, "NOTIFICATION!");
    },
    render() {
        var UserData = this.props.User.information;
        if(this.state.playerStats != null) {
            var Statistics = this.state.playerStats,
                levelProgress = Math.round((Statistics.stats.Player.points - Statistics.level.lower_limit) / (Statistics.level.upper_limit - Statistics.level.lower_limit) * 100);
            
        }
        
        return (
            this.props.fetchingData ? 
            <GameLoadingGif />
            :
            <div>
                <div className="container col-md-12 marginTop3">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="row">
                                
                                {this.state.mappedCategories}
                            </div>
                        </div>
                        {this.state.playerStats != null ?
                        <div className="col-md-3">
                            <PlayerGameStats wps={Statistics.stats.current_wps} points={Statistics.stats.Player.points} levelName={Statistics.level.name} progress={levelProgress} player={UserData} />
                        </div>
                        :""
                        }
                        
                        
                        <SpaceActionBtn command="CTRL + SPACE" message="Start random Game" secondMsg="CTRL+Z for PRACTICE"/>
                    </div>
                </div>
            </div>
        )
    }
})

// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user, fetchingData: state.game.fetchingData};
};
var mapDispatchToProps = function(dispatch){
    return {
        toggleDataFetching: function() {dispatch(authActions.toggleDataFetching())},
        setPlayerStats: function(jsonData){ dispatch(gameActions.setPlayerStats(jsonData)); }
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(GameHomeContainer);