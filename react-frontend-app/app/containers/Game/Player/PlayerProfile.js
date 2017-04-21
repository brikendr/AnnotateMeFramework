var React = require('react');
var PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets,
    actions = require('../../../redux/actions/authActions'),
    GameHelper = require('../../../utils/GameHelper'),
    Badge = require('../../../components/Game/Extras/ProfileBadges');

var PlayerProfile = React.createClass({
    getInitialState: function() {
        return {
            mappedCandidates: [],
            animation: "",
            showGamePoint: null,
            playerStats: null,
            challengeStats: {
                'wins': 0,
                'loses': 0,
                'draw': 0
            }
        }
    },
    propTypes:{
        User: PropTypes.object.isRequired,
        toggleDataFetching: PropTypes.func.isRequired,
        fetchingData: PropTypes.bool.isRequired,
        playerStats: PropTypes.object.isRequired
    },
    componentDidMount() {
        require('../../../styles/profile.css');
        require('../../../assets/js/plugins/jquery.flot.min.js');
        require('../../../assets/js/plugins/jquery.flot.categories.min.js');

        this.props.toggleDataFetching();
        
        //GET Profile stats from db
        GameHelper.getProfileStats(this.props.User.information.id)
         .then(function(response){
             this.setState({playerStats: response.resource});
             this.calculateChallengeRatios(response.resource.challengeRatio)
             this.props.toggleDataFetching();
             this.drawChart();
         }.bind(this));
        
    },
    handleCandidateSelection(e){
        if([49, 50, 51, 52].indexOf(e.keyCode) != -1) {
            if(e.keyCode == (48 + this.props.correctAnswer)) {
                this.setState({animation: "bg-green-jungle bg-font-green-jungle animated bounce", showGamePoint: <GamePoint point={10}/>});
                this.playAudio("check-right");
            } else {
                this.setState({animation: "bg-red-mint bg-font-red-mint animated shake"});
                this.playAudio("check-wrong");
            }
            this.unbindListeners();
        } 
    },
    calculateChallengeRatios(challengeRatio) {
        var challengeStats = this.state.challengeStats;
        for(var i=0; i < challengeRatio.length; i++) {
            switch(challengeRatio[i].status) {
                case 1:
                case 4: {
                    challengeStats.wins += challengeRatio[i].count;break;
                } 
                case 2: 
                case 5: {
                    challengeStats.loses += challengeRatio[i].count;break;
                }
                case 3:
                case 6: {
                    challengeStats.draw += challengeRatio[i].count;break;
                }
            }
        }
        this.setState({challengeStats: challengeStats})
    },
    unbindListeners() {
        //document.body.removeEventListener("keydown", this.handleCandidateSelection);
    },
    playAudio(soundID) {
        var audio = document.getElementById(soundID);		
        audio.play();
    },
    drawChart() {
        function showChartTooltip(x, y, xValue, yValue) {
                $('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y - 40,
                    left: x - 40,
                    border: '0px solid #ccc',
                    padding: '2px 6px',
                    'background-color': '#fff'
                }).appendTo("body").fadeIn(200);
            }
        var wpmHistory = this.state.wpmPerformance;
        $('#site_statistics_loading').hide();
        $('#site_statistics_content').show();

        //Prepare Data 
        var chartData = this.state.playerStats.wpmPerformances,
            newData = [];
        for(var i = 0; i < chartData.length; i++) {
            var label = i == chartData.length - 1 ? "Last": (i+1);
            newData.push([label, chartData[(chartData.length-1) - i].value]);
        }
        
        var plot_statistics = $.plot($("#site_statistics"), [{
                data: newData,
                lines: {
                    fill: 0.6,
                    lineWidth: 0
                },
                color: ['#f89f9f']
            }, {
                data: newData,
                points: {
                    show: true,
                    fill: true,
                    radius: 5,
                    fillColor: "#f89f9f",
                    lineWidth: 3
                },
                color: '#fff',
                shadowSize: 0
            }],

            {
                xaxis: {
                    tickLength: 0,
                    tickDecimals: 0,
                    mode: "categories",
                    min: 0,
                    font: {
                        lineHeight: 14,
                        style: "normal",
                        variant: "small-caps",
                        color: "#6F7B8A"
                    }
                },
                yaxis: {
                    ticks: 5,
                    tickDecimals: 0,
                    tickColor: "#eee",
                    font: {
                        lineHeight: 14,
                        style: "normal",
                        variant: "small-caps",
                        color: "#6F7B8A"
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#eee",
                    borderColor: "#eee",
                    borderWidth: 1
                }
            });

        var previousPoint = null;
        $("#site_statistics").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' WPM');
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }

            
        });
    },
    
    render() {
        var UserData = this.props.User.information;
        if(this.props.playerStats != null) {
            var Statistics = this.props.playerStats,
                levelProgress = Math.round((Statistics.stats.Player.points - Statistics.level.lower_limit) / (Statistics.level.upper_limit - Statistics.level.lower_limit) * 100);
            
        }
        return ( 
            this.props.fetchingData ? 
            <GameLoadingGif />
            :
            <div className="container col-md-11 marginTop2 " style={styles.profileBackground}>
                <div className="row justify-content-center marginTop5">
                    <div className="col-md-12">
                        <div className="profile-sidebar">
                            <div className="portlet light profile-sidebar-portlet bordered">
                                <div className="profile-userpic">
                                    <img src={assetsDir + "img/game-avatar.png"} className="img-responsive" alt="" /> 
                                </div>
                                
                                <div className="profile-usertitle">
                                    <div className="profile-usertitle-name"> {this.props.User.information.username} </div>
                                    <div className="profile-usertitle-job"> {Statistics.level.name} </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-8">
                                        <div className="progress-info">
                                            <div className="progress progress-striped active">
                                                <div className="progress-bar progress-bar-success green-sharp" role="progressbar" aria-valuenow={levelProgress} aria-valuemin="0" aria-valuemax="100" style={{width: levelProgress+"%"}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="profile-userbuttons">
                                    <h4>Challenges</h4>
                                    <button type="button" className="btn btn-circle red-thunderbird btn-sm">Lost: {this.state.challengeStats != null ? this.state.challengeStats.loses: "N/A"}</button>
                                    <button type="button" className="btn btn-circle grey-cascade btn-sm">Draw: {this.state.challengeStats != null ? this.state.challengeStats.draw: "N/A"}</button>
                                    <button type="button" className="btn btn-circle green-jungle btn-sm">Won: {this.state.challengeStats != null ? this.state.challengeStats.wins: "N/A"}</button>
                                </div>
                                <div className="row list-separated profile-stat">
                                    <div className="col-md-6 col-sm-6 col-xs-8">
                                        <div className="uppercase profile-stat-title"> {this.state.playerStats != null ? this.state.playerStats.highestWpm: "N/A"} </div>
                                        <div className="uppercase profile-stat-text"> Highest WPM </div>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-xs-8">
                                        <div className="uppercase profile-stat-title font-green-jungle"> {this.state.playerStats != null ? this.state.playerStats.bettingRatio: "N/A"}% </div>
                                        <div className="uppercase profile-stat-text"> Betting Ratio </div>
                                    </div>
                                </div>
                            </div>
                        </div>             
                        
                        <div className="profile-content">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="portlet light bordered">
                                            <div className="portlet-title">
                                                <div className="caption caption-md">
                                                    <span className="caption-subject font-blue-madison bold uppercase">Performance Chart (Last 10 WPM performances)</span>
                                                </div>
                                            </div>
                                            <div className="portlet-body">
                                                <div id="site_statistics_content" > 
                                                    <div id="site_statistics" className="chart"> </div>
                                                </div>
                                            </div>
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
    profileBackground: {
        padding: "1%",
        background: 'rgb(0, 188, 212)'
    }
}
// connect to Redux store
var mapStateToProps = function(state){
    // This component will have access to `appstate.heroes` through `this.props.heroes`
    return {User: state.user, fetchingData: state.game.fetchingData, playerStats: state.game.playerStats};
};
var mapDispatchToProps = function(dispatch){
    return {
        toggleDataFetching: function() {dispatch(actions.toggleDataFetching())}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(PlayerProfile);