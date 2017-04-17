var React = require('react');
var PropTypes = React.PropTypes,
    assetsDir = require('../../../utils/constatns').assets
    Badge = require('../../../components/Game/Extras/ProfileBadges');

var PlayerProfile = React.createClass({
    getInitialState: function() {
        return {
            mappedCandidates: [],
            animation: "",
            showGamePoint: null,
        }
    },
    componentDidMount() {
        require('../../../styles/profile.css');
        require('../../../assets/js/plugins/jquery.flot.min.js');
        require('../../../assets/js/plugins/jquery.flot.categories.min.js');
        this.drawChart();
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
        var visitors = [
                ['02/2013', 20],
                ['03/2013', 34],
                ['04/2013', 17],
                ['05/2013', 33],
                ['06/2013', 56],
                ['07/2013', 43],
                ['08/2013', 48],
                ['09/2013', 15],
                ['10/2013', 26]
            ];
        $('#site_statistics_loading').hide();
        $('#site_statistics_content').show();

        var plot_statistics = $.plot($("#site_statistics"), [{
                data: visitors,
                lines: {
                    fill: 0.6,
                    lineWidth: 0
                },
                color: ['#f89f9f']
            }, {
                data: visitors,
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
        return ( 
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
                                    <div className="profile-usertitle-job"> Newbie </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-8">
                                        <div className="progress-info">
                                            <div className="progress progress-striped active">
                                                <div className="progress-bar progress-bar-success green-sharp" role="progressbar" aria-valuenow={10} aria-valuemin="0" aria-valuemax="100" style={{width: "70%"}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="profile-userbuttons">
                                    <h4>Challenges</h4>
                                    <button type="button" className="btn btn-circle red-thunderbird btn-sm">Lost: 3</button>
                                    <button type="button" className="btn btn-circle grey-cascade btn-sm">Draw: 3</button>
                                    <button type="button" className="btn btn-circle green-jungle btn-sm">Won: 5</button>
                                </div>
                                <div className="row list-separated profile-stat">
                                    <div className="col-md-6 col-sm-6 col-xs-8">
                                        <div className="uppercase profile-stat-title"> 37 </div>
                                        <div className="uppercase profile-stat-text"> Highest WPM </div>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-xs-8">
                                        <div className="uppercase profile-stat-title font-green-jungle"> 80% </div>
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
                                                    <span className="caption-subject font-blue-madison bold uppercase">WPM Performance Chart</span>
                                                </div>
                                            </div>
                                            <div className="portlet-body">
                                                <div id="site_statistics_content" > 
                                                    <div id="site_statistics" className="chart"> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 marginTop1">
                                        <div className="portlet light bordered">
                                            <div className="portlet-title">
                                                <div className="caption caption-md">
                                                    <span className="caption-subject font-blue-madison bold uppercase">Accomplishments</span>
                                                </div>
                                            </div>
                                            <div className="portlet-body">
                                                <div className="row">
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
                                                    <Badge badgeName="Badge1" />
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
    return {User: state.user, fetchingData: state.game.fetchingData};
};
var mapDispatchToProps = function(dispatch){
    return {
        toggleDataFetching: function() {dispatch(actions.toggleDataFetching())}
    }
};
module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(PlayerProfile);