import React from 'react';
import { withRouter, Link } from 'react-router-dom';


import Filmdatabase from './Filmdatabase';
import FilmItem from "./FilmItem"
import '../css/FilmInfo.scss';




class FilmInfo extends React.Component {
    constructor(props) {
        super(props);
        var defualtInformation = {
            filmLanguage: "English",
            mainBanner: 'http://www.warnerbros.it/blog2/wp-content/uploads/2014/10/FL-17686.jpg',
            posterImage: 'http://fo4mw16y1z42edr6j2m4n6vt.wpengine.netdna-cdn.com/wp-content/uploads/interstellar-imaxv11.jpg',
            filmTitle: 'INTERSTELLAR',
            adult: 'true',
            filmDetailedDescription: 'Interstellar chronicles the adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
            filmGenre: 'Adventure, Drama, Science Fiction',
            filmGenreDescriprion: 'Legendary Entertainment, Syncopy, Lynda Obst Productions',
            filmRelease: '2014-11-05',
            voteCount: '24456',
            vote: '8.3 / 10',
        }

        this.state = {
            default: defualtInformation,
            filmArray: [],
            info:  /* defualt information display */ defualtInformation

        }

        /* DOM ref */
        this.filmListRef = React.createRef();
    }



    /* Browser PopState */
    prevState(param) {
        return this.setState({
            filmArray: this.state.filmArray,
            info: param,
        })

    }


    /*Film List Change*/
    retrieveFilmData(info) {

        /* storing new data  */
        var filmArray = this.state.filmArray;
        var filmGenre = [];
        var languages = [];
        var filmInfo = {
            filmLanguage: languages,
            filmGenre: filmGenre,
            mainBanner: "https://image.tmdb.org/t/p/original" + info.backdrop_path,
            posterImage: "https://image.tmdb.org/t/p/w500" + info.poster_path,
            adult: "" + info.adult + "",
            filmTitle: info.original_title,
            filmDetailedDescription: info.overview,
            filmRelease: info.release_date,
            voteCount: info.voteCount,
            vote: info.vote_average,
            id: info.id
        }
        filmArray.push(filmInfo)
        /* genreating language string*/
        Filmdatabase.generateLanguageStrings().then(response => {
            response.map(value1 => {
                if (value1.iso_639_1 === info.original_language) {
                    languages.push(value1.english_name)
                }
            })
            /* genreating genre string*/
            Filmdatabase.generateGenreString().then(response => {
                info.genre_ids.map(value => {
                    response.genres.map(value2 => {
                        if (value == value2.id) {
                            filmGenre.push(`${value2.name}  `)
                        }
                    })
                })
                /* clearing search */
                this.props.clearSearch();
                /* returning new data */
                return this.setState({
                    filmArray: filmArray,
                    info: filmInfo,
                })
            })
        })
    }

    /* Browser back and forward button function */
    componentDidMount() {
        window.onpopstate = () => {
            var param = window.location.href
            var index = param.indexOf("m/");
            param = param.slice(index + 2, param.length)

            if (param == "157336") {
                this.prevState(this.state.default)
                this.props.clearSearch()
            }
            else {
                this.state.filmArray.map(val => {
                    if (val.id == param) {
                        this.prevState(val)
                        this.props.clearSearch()
                    }
                })
            }
        }
    }

    /* Ensure Film List Starts at Top */
    componentDidUpdate() {
        if (this.props.displayFilmList !== true) {
            this.filmListRef.current.scrollTo(0, 0);
        }
    }

    render() {


        /* Render Film Data Into DOM */
        var filmList = [];
        if (typeof this.props.filmList != 'undefined') {
            if (this.props.filmList.length > 0) {
                this.props.filmList.map(value => {
                    filmList.push(<Link key={value.id} style={{ textDecoration: "none" }}
                        to={{
                            pathname: `/film/${value.id}`,
                            state: { detail: this.state.info.info }
                        }} > < FilmItem
                            key={value.id}
                            onClick={(info) => this.retrieveFilmData(info)}
                            info={value} key={value.id}
                            title={value.original_title} /></Link>);
                })
            }
        }

        return (

            <div className="film_info_wrapper">

                {/*Film Ineer Wrapper*/}
                <div className="film_info_inner_wrapper">

                    {/*Film Ineer Wrapper Left*/}
                    <div className="film_info_inner_wrapper_left">
                        <img className="film_image" src={this.state.info.posterImage} />
                    </div>

                    {/*Film Inner Wrapper Right*/}
                    <div className="film_info_inner_wrapper_right">
                        <div ref={this.filmListRef} className={this.props.displayFilmList == true ? "film_list active" : "film_list"}>
                            {filmList}
                        </div>

                        {/*Film Introduction*/}
                        <div className="film_introduction">
                            <p className="film_introduction_title" style={{ fontFamily: "Lato" }} > {this.state.info.filmTitle} </p>

                            <p className="film_introduction_story" style={{ fontFamily: "Oswald" }} > {this.state.info.filmDetailedDescription} </p>

                        </div>

                        {/*Film Information*/}
                        <div className="film_information">
                            <div id="filmGenre"> <h2 style={{ fontFamily: "Oswald" }}>Genre:</h2> <h4 style={{ fontFamily: "Oswald" }}>{this.state.info.filmGenre}</h4> </div>
                            <div className="film_information_addittional_row1">
                                <div className="row1_item1">
                                    <p style={{ fontFamily: "Lato", paddingRight: "1.5rem" }}>Original Release:</p>
                                    <h2 style={{ fontFamily: "Oswald" }} className="aqua">{this.state.info.filmRelease}</h2>
                                </div>
                                <div className="row1_item2">
                                    <p style={{ fontFamily: "Lato" }}>Adult:</p>
                                    <h2 style={{ fontFamily: "Oswald" }} className="aqua">{this.state.info.adult}</h2>
                                </div>
                            </div>
                            <div className="film_information_addittional_row2">
                                <div className="row2_item1">
                                    <p style={{ fontFamily: "Lato", paddingRight: "1.5rem" }}>Original Language:</p>
                                    <h2 style={{ fontFamily: "Oswald" }} className="aqua">{this.state.info.filmLanguage}</h2>
                                </div>
                                <div className="row2_item2">
                                    <p style={{ fontFamily: "Lato" }}>Vote Average:</p>
                                    <h2 style={{ fontFamily: "Oswald" }} className="aqua">{this.state.info.vote}</h2>
                                </div>


                            </div>
                        </div>
                    </div>


                </div>
                {/* Background Tint */}
                <div className="background" style={{ backgroundImage: `url("${this.state.info.mainBanner}")`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }} >
                    <div className="background_tint"></div>
                </div>
            </div>

        );
    }


}

export default withRouter(FilmInfo);
