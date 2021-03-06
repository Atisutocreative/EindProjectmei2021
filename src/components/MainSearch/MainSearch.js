import React, {Component} from 'react';
import axios from 'axios';
import SearchBarMain from './SearchBarMain';
import ResultsMain from './ResultsMain';
import ImgList from './ImgList';
import styles from './MainSearch.module.css'
import ComingSoon from "../ComingSoon/ComingSoon";


class MainSearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: 'sun',
            items: [],
            imgs: [],
            loader: '',
            loader2: '',
            mediaType: 'images',
        };
    }

    handle_authorisation () {
        const clientId = process.env.REACT_APP_API_SSCLIENT;
        const clientSecret = process.env.REACT_APP_API_SSSECRET;

        if (!clientId || !clientSecret) {
            console.log('not authorised');
            return;
        }
        return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
    }

    handle_searchTerms(e) {
        e.preventDefault();
        const API_URL = 'https://api.shutterstock.com/v2';
        const mediaType = this.state.mediaType;
        const query = this.state.searchTerm;
        const authorisation = this.handle_authorisation();
        this.setState({loader: 'Aan het laden'})
        console.log("Zoeken naar: ", this.state.searchTerm)

        axios({
            method: 'get',
            url: API_URL + '/' + mediaType + '/search',
            params: {
                query
            },
            headers: {
                Authorization: authorisation
            }
        })
            .then((response) => {
                const items = response.data.data;
                if (items.length === 0)
                    this.setState({items: [], loader: 'Geen plaatjes gevonden op Shutterstock'});
                else
                    this.setState({items, loader: false});
            })
            .catch(err => {
                console.log("ERROR Shutterstock", err);
            })

        axios
            .get(
                `https://api.unsplash.com/search/photos/?page=1&per_page=20&query=${query}&client_id=${process.env.REACT_APP_API_KEY}`
            )
            .then(data => {
                if (data.data.results.length === 0)
                    this.setState({loader2: 'Geen plaatjes gevonden op UnSplash', imgs: []});
                else
                    this.setState({imgs: data.data.results, loader2: false});
            })
            .catch(err => {
                console.log('ERROR Unsplash', err);
            });
    }

    render() {
        return (
            <div className={styles["container"]}>
                <form className={styles["item"]} id={styles["box-a"]}>
                    <SearchBarMain
                        value={this.state.SearchTerm}
                        action_change={e => this.setState({searchTerm: e.target.value})}
                        action_click={(e) => this.handle_searchTerms(e)}/>
                </form>
                <div className={styles["item"]} id={styles["box-b"]}>
                    <h1>Unsplash</h1>
                    <h2>{this.state.loader2}</h2>
                    <ImgList data={this.state.imgs}/>
                </div>
                <div className={styles["item"]} id={styles["box-c"]}>
                    <h1>Shutterstock</h1>
                    <h2>{this.state.loader}</h2>
                    {this.state.items.map(item => <ResultsMain item={item} key={item.id}/>)}
                </div>
                <div className={styles["item"]} id={styles["box-d"]}>
                    <ComingSoon/>
                </div>
                <div className={styles["item"]} id={styles["box-e"]}>
                    <h2>Je bent ingelogd</h2>
                </div>
            </div>
        );
    }
}

export default MainSearchBar;