var React = require('react'),
    PropTypes = React.PropTypes,
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    authActions = require('../../redux/actions/authActions'),
    gameActions = require('../../redux/actions/utilActions'),
    CategoryTile = require('../../components/Game/Dashboard/CategoryTile'),
    PlayerGameStats = require('../../components/Game/Dashboard/PlayerGameStats'),
    SpaceActionBtn = require('../../components/Game/SpaceActionBtn')

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
        this.props.toggleDataFetching();
        GameHelper.getCategoriesAndPlayerStats(this.props.User.information.id)
        .then(function(response){
            this.mapCategories(response.categories);
            this.props.toggleDataFetching();
            this.setState({playerStats: response.playerStats});
            
            //Store stats in redux store state 
            this.props.setPlayerStats(response.playerStats);
        }.bind(this));
        document.addEventListener("keydown", this.commandListener);
    },
    mapCategories(categories) {
        var i = 1;
        const catList = categories.map(category => 
            <CategoryTile key={category.id} progress={40} categoryName={category.name} icon={category.logo_path} keyCode={i++} />
        );
        this.setState({
            mappedCategories: catList
        })
    },
    commandListener(e) {
        switch(e.keyCode) {
            case 49: {
                alert('1');
                break;
            }
            case 50: {
                alert('2');
                break;
            }
            case 51: {
                alert('3');
                break;
            }
            case 52: {
                alert('4');
                break;
            }
            case 53: {
                alert('5');
                break;
            }
            case 54: {
                alert('6');
                break;
            }
            case 55: {
                alert('7');
                break;
            }
            case 56: {
                alert('8');
                break;
            }
        }
        if (e.ctrlKey && e.keyCode == 32) {
            var randomCategory = Math.floor((Math.random() * this.state.mappedCategories.length));
            var selectedCategory = this.state.mappedCategories[randomCategory];
            this.redirectGame('play');
        }
    },
    redirectGame(path) {
        document.removeEventListener("keydown", this.commandListener);
        this.context.router.push(path);
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
                        
                        
                        <SpaceActionBtn command="CTRL + SPACE" message="Start random Game" />
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