var React = require('react'),
    PropTypes = React.PropTypes,
    GameHelper = require('../../utils/GameHelper'),
    GameLoadingGif =  require('../../components/Game/GameLoadingGif'),
    ReactRedux = require("react-redux"),
    actions = require('../../redux/actions/authActions'),
    CategoryTile = require('../../components/Game/Dashboard/CategoryTile'),
    PlayerGameStats = require('../../components/Game/Dashboard/PlayerGameStats'),
    SpaceActionBtn = require('../../components/Game/SpaceActionBtn')

var GameHomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            mappedCategories: []
        }
    },
    propTypes:{
        User: PropTypes.object.isRequired
    },
    componentDidMount(){
        this.props.toggleDataFetching();
        GameHelper.getCategories()
        .then(function(response){
            this.mapCategories(response.resource);
            this.props.toggleDataFetching();
        }.bind(this))
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
            case 32: {
                var randomCategory = Math.floor((Math.random() * this.state.mappedCategories.length));
                var selectedCategory = this.state.mappedCategories[randomCategory];
                console.log('SELECTED CATEGORY IS ', selectedCategory);
                this.redirectGame('play');
            }
        }
    },
    redirectGame(path) {
        document.removeEventListener("keydown", this.commandListener);
        this.context.router.push(path);
    },
    render() {
        var UserData = this.props.User.information;
        return (
            this.props.fetchingData ? 
            <GameLoadingGif />
            :
            <div>
                <div className="container col-md-12 marginTop5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="row">
                                
                                {this.state.mappedCategories}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <PlayerGameStats wps={30} points={120} levelName="Newbie" progress={80} />
                        </div>
                        <div className="col-md-6">
                            <SpaceActionBtn message="Hit SPACE to start random game"/>
                        </div>
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
        toggleDataFetching: function() {dispatch(actions.toggleDataFetching())}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(GameHomeContainer);