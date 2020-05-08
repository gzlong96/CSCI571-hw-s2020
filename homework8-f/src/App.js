import React from 'react';
import {Col, Container, Image, Nav, Row, Card, Modal, Badge, NavItem, Button, Collapse} from 'react-bootstrap';
import {Route, Switch} from 'react-router-dom';
import {FiBookmark, FiMenu} from 'react-icons/fi';
import {MdShare, MdBookmark} from 'react-icons/md';
import {FaTrash, FaChevronDown, FaChevronUp} from 'react-icons/fa';
import NGSwitch from "react-switch";
import Navbar from 'react-bootstrap/Navbar';
import AsyncSelect from 'react-select/lib/Async';
import fetch from "node-fetch";
import _ from "lodash";
import {EmailShareButton, FacebookShareButton, TwitterShareButton,
    EmailIcon, FacebookIcon, TwitterIcon} from "react-share";
import commentBox from 'commentbox.io';
import Loader from "react-spinners/BounceLoader";
import ReactTooltip from 'react-tooltip'
import { Element , Events, scrollSpy, scroller } from 'react-scroll'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import LinesEllipsis from 'react-lines-ellipsis'
import MediaQuery from 'react-responsive'
import 'react-toastify/dist/ReactToastify.css';
// import logo from './logo.svg';
// import "./bootstrap-theme.css"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import store from 'storejs';


// const http_prefix = 'http://localhost:3001/';
const http_prefix = 'https://csci571hw8b-123467.appspot.com/';

function get_badge(section){
    // console.log("get badge");
    // console.log(section);
    if (section==='world')
        return (<Badge className={'badge_position badge_'+section}>WORLD</Badge>);
    if (section==='politics')
        return (<Badge className={'badge_position badge_'+section}>POLITICS</Badge>);
    if (section==='business')
        return (<Badge className={'badge_position badge_'+section}>BUSINESS</Badge>);
    if (section==='technology')
        return (<Badge className={'badge_position badge_'+section}>TECHNOLOGY</Badge>);
    if (section==='sport' || section==='sports')
        return (<Badge className={'badge_position badge_sports'}>SPORTS</Badge>);
    if (section==='g')
        return (<Badge className={'badge_position badge_g'}>GUARDIAN</Badge>);
    if (section==='n')
        return (<Badge className={'badge_position badge_n'}>NYTIMES</Badge>);
    if (section==='')
        section = 'other';
    return (<Badge className={'badge_position badge_default'}>{section.toUpperCase()}</Badge>);
}


class MyLinesEllipsis extends LinesEllipsis{
    constructor(props) {
        super(props);
        this.props.onRef(this)
    }
}


class SectionCard extends React.Component{
    constructor(props) {
        super(props);
        this.state = { opened: false };
        this.goToDetail = this.goToDetail.bind(this);
        // console.log(this.props.url)
    }

    share(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({opened:true});
        return false
    }

    goToDetail(){
        // this.props.updateSource(this.props.source);
        window.location.href = "#detail?id="+this.props.id;
    }

    render() {
        return (
            <>
                <div className={'min_border'}>
                    <Container className={'section_card'} onClick={this.goToDetail}>
                        {/*<Nav.Link href={"#detail?id="+this.props.id}>*/}
                            <Row >
                                <Col xs={12} sm={5} md={4} lg={3}>
                                    <Image src={this.props.image} thumbnail />
                                </Col>
                                <Col>
                                    <p className={'title'}>{this.props.title}<MdShare onClick={(e)=>this.share(e)}/></p>
                                    <p className={'description'}>{this.props.description}</p>
                                    <p>
                                        <span className={'date'}>{this.props.date}</span>
                                        <span>{get_badge(this.props.sectionId)}</span>
                                    </p>
                                </Col>
                            </Row>
                        {/*</Nav.Link>*/}
                    </Container>
                </div>


                <Modal show={this.state.opened} onHide={()=>this.setState({opened:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title className='modal_title_my'>{this.props.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='modal_share_text'> Share Via </div>
                        <Container>
                            <Row>
                                <Col xs={4} className='central_my'>
                                    <FacebookShareButton url={this.props.url} hashtag="#CSCI571">
                                        <FacebookIcon size={48} round={true} />
                                    </FacebookShareButton>
                                </Col>
                                <Col xs={4} className='central_my'>
                                    <TwitterShareButton url={this.props.url} hashtags={["CSCI571"]}>
                                        <TwitterIcon size={48} round={true} />
                                    </TwitterShareButton>
                                </Col>
                                <Col xs={4} className='central_my'>
                                    <EmailShareButton url={this.props.url}>
                                        <EmailIcon size={48} round={true} />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}


class SectionBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = { section: this.props.section, source: this.props.source, loaded: false };
        // this.get_cards = this.get_cards.bind(this);
        console.log('body constructed')
    }

    get_cards(source, section){
        const that = this;
        if (this.state.loaded){
            this.setState({loaded: false});
        }
        fetch(http_prefix + source + '?section=' + section)
            .then(response => response.json())
            .then(function(response) {
                console.log("fetch data:" + section);
                that.setState({cards: response.map((one_article) =>
                        <SectionCard image={one_article.image} title={one_article.title} id={one_article.id}
                                     description={one_article.description} date={one_article.date} key={one_article.id}
                                     sectionId={one_article.sectionId} url={one_article.url}/>),
                                    loaded: true})
            })
    }

    componentDidMount() {
        this.get_cards(this.props.source, this.props.section);
    }

    componentWillReceiveProps(newProps){
        this.get_cards(newProps.source, newProps.section);
    }

    render() {
        // console.log(this.state.cards);
        // console.log("card body render");
        // console.log(this.props.section);
        return (
            <div>
                <div>
                    <div className='loader_position'>
                        <div className='loader_position2'>
                            <Loader
                                size={50}
                                color={"#123abc"}
                                loading={!this.state.loaded}
                                // loading={true}
                            />
                        </div>
                        {this.state.loaded? (<></>): "Loading"}
                    </div>
                </div>
                {this.state.loaded? this.state.cards: (<></>)}
            </div>
        );
    }
}


class SearchCard extends React.Component{
    constructor(props) {
        super(props);
        this.state = { opened: false };
        this.goToDetail = this.goToDetail.bind(this);
    }

    goToDetail(){
        // this.props.updateSource(this.props.source);
        window.location.href = "#detail?id="+this.props.id;
    }

    share(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({opened:true});
        return false
    }

    render() {
        return (
            <>
                <Col xs={12} sm={6} md={4} lg={3} className="my_no_padding">
                    <Card className={'search_card'} onClick={this.goToDetail}>
                        <Card.Title>
                            <span className={'card_title_my'}>{this.props.title}</span>
                            <MdShare onClick={(e)=>this.share(e)}/>
                        </Card.Title>
                        <Card.Img src={this.props.image}/>
                        <Card.Text>
                            <div>
                                <span className={'date'}>{this.props.date}</span>
                                <span>{get_badge(this.props.sectionId)}</span>
                            </div>
                        </Card.Text>
                    </Card>
                </Col>

                <Modal show={this.state.opened} onHide={()=>this.setState({opened:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title className='modal_title_my'>{this.props.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='modal_share_text'> Share Via </div>
                        <Container>
                            <Row>
                                <Col xs={4} className='central_my'>
                                    <FacebookShareButton url={this.props.url} hashtag="#CSCI571">
                                        <FacebookIcon size={48} round={true} />
                                    </FacebookShareButton>
                                </Col>
                                <Col xs={4} className='central_my'>
                                    <TwitterShareButton url={this.props.url} hashtags={["CSCI571"]}>
                                        <TwitterIcon size={48} round={true} />
                                    </TwitterShareButton>
                                </Col>
                                <Col xs={4} className='central_my'>
                                    <EmailShareButton url={this.props.url}>
                                        <EmailIcon size={48} round={true} />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}


class SearchBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = {source: this.props.source, loaded: 0 };
        // this.get_cards = this.get_cards.bind(this);
        console.log('body constructed')
    }

    get_cards(source, q){
        const that = this;
        if (typeof(q) ==='undefined'){
            this.setState({cards: <></>})
            return
        }
        fetch(http_prefix + source +'s?q=' + q)
            .then(response => response.json())
            .then(function(response) {
                console.log("fetch data:" + q);
                // console.log(response);
                that.setState({cards: response.map((one_article) =>
                        <SearchCard image={one_article.image} title={one_article.title} id={one_article.id}
                                    description={one_article.description} date={one_article.date} key={one_article.id}
                                    sectionId={one_article.sectionId} />)})
            })
    }

    componentDidMount() {
        this.get_cards(this.props.source, this.props.q);
    }

    componentWillReceiveProps(newProps){
        this.get_cards(newProps.source, newProps.q);
    }

    render() {
        return (
            <Container>
                <h3>Results</h3>
                <Row>
                    {this.state.cards}
                </Row>
            </Container>
        );
    }
}


class BookmarkCard extends React.Component{
    constructor(props) {
        super(props);
        this.state = { opened: false };
        this.deleteMark = this.deleteMark.bind(this);
        this.goToDetail = this.goToDetail.bind(this);
    }

    deleteMark(e){
        // e.preventDefault();
        e.stopPropagation();
        store.remove(this.props.id);
        this.props.deleteRefresh();
        toast("Removing " + this.props.title, {
            position: "top-center",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        // return false
    }

    goToDetail(){
        this.props.updateSource(this.props.source);
        window.location.href = "#detail?id="+this.props.id;
    }

    share(e){
        // e.preventDefault();
        e.stopPropagation();
        this.setState({opened:true});
        // return false
    }

    render() {
        return (
            <>
                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card className={'search_card'} onClick={this.goToDetail}>
                        <Card.Title>
                            <span className={'card_title_my'}>{this.props.title}</span>
                            <MdShare onClick={(e)=>this.share(e)}/>
                            <FaTrash onClick={(e)=>this.deleteMark(e)}/>
                        </Card.Title>
                        <Card.Img src={this.props.image}/>
                        <Card.Text>
                            <div>
                                <span className={'date'}>{this.props.date}</span>
                                <span>{get_badge(this.props.sectionId)}</span>
                                <span>{get_badge(this.props.source)}</span>
                            </div>
                        </Card.Text>
                    </Card>
                </Col>

                <Modal show={this.state.opened} onHide={()=>this.setState({opened:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title className='modal_title_my'>
                            <span className={'modal_source'}>{(this.props.source==='n'? 'NYTimes': 'Guardian')}</span>
                            <br/>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='modal_share_text'> Share Via </div>
                        <Container>
                            <Row>
                                <Col xs={4} className='central_my'>
                                    <FacebookShareButton url={this.props.url} hashtag="#CSCI571">
                                        <FacebookIcon size={48} round={true} />
                                    </FacebookShareButton>
                                </Col>
                                <Col xs={4} className='central_my'>
                                    <TwitterShareButton url={this.props.url} hashtags={["CSCI571"]}>
                                        <TwitterIcon size={48} round={true} />
                                    </TwitterShareButton>
                                </Col>
                                <Col xs={4} className='central_my'>
                                    <EmailShareButton url={this.props.url}>
                                        <EmailIcon size={48} round={true} />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}


class BookmarkBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = {source: this.props.source, loaded: 0 };
        this.deleteRefresh = this.deleteRefresh.bind(this);
        console.log('body constructed')
    }


    get_cards(){
        const old_all_keys = store.keys();
        // console.log(store.keys());
        let all_keys = [];
        for (let i=0; i<old_all_keys.length; ++i){
            // console.log(old_all_keys[i]);
            // console.log(store(old_all_keys[i]));
            if (old_all_keys[i]!=='source'){
                all_keys.push(old_all_keys[i]);
            }
        }
        if (all_keys.length === 0){
            this.setState({cards: (<div className={'central_my my_100_width'}><h5>You have no saved article</h5></div>)});
            return
        }

        const all_cards = all_keys.map((one_key) =>{
            let one_article = JSON.parse(store(one_key));
            return (<BookmarkCard image={one_article.image} title={one_article.title} source={one_article.source}
                   date={one_article.date} key={one_article.id} sectionId={one_article.sectionId} id={one_article.id}
                    deleteRefresh={this.deleteRefresh} updateSource={this.props.updateSource}/>)
            }
        );

        this.setState({cards: all_cards});
    }


    deleteRefresh(){
        this.get_cards();
    }

    componentDidMount() {
        this.get_cards();
    }

    componentWillReceiveProps(newProps){
        this.get_cards();
    }

    render() {
        return (
            <Container>
                <h3>Favorites</h3>
                <Row>
                    {this.state.cards}
                </Row>
            </Container>
        );
    }
}


class DetailBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = {source: this.props.source, loaded: false, max_line: 6, saved:store.has(this.props.id),
            check_arrow: 0, show_arrow: false};
        this.get_detail = this.get_detail.bind(this);
        this.changeSave = this.changeSave.bind(this);
        // console.log('body constructed');
        // console.log(store.has(this.props.id));
    }

    changeSave(){
        // console.log("save changed");
        // console.log(this.state.saved);
        if (this.state.saved){
            this.setState({saved:false});
            store.remove(this.props.id);
            toast("Removing " + this.state.title, {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        else{
            this.setState({saved:true});
            const saved_data = {id:this.props.id, url:this.state.url, title:this.state.title,
                                sectionId: this.state.sectionId, source:this.props.source, image:this.state.image,
                                date:this.state.date};
            store(this.props.id, JSON.stringify(saved_data));
            toast("Saving " + this.state.title, {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

    }

    get_detail(source, id){
        const that = this;
        if (this.state.loaded){
            this.setState({loaded: false});
        }
        fetch(http_prefix + source +'d?id=' + id)
            .then(response => response.json())
            .then(function(response) {
                console.log("fetch data:" + id);
                that.setState({url: response.url, title: response.title, date: response.date,
                                    image: response.image, description: response.description,
                                    sectionId:response.sectionId, loaded:true})
            })
    }

    componentDidMount() {
        this.get_detail(this.props.source, this.props.id);
        console.log("mounted");
        // console.log(this.props.source);
        this.removeCommentBox = commentBox("5674849003372544-proj",{
            createBoxUrl(boxId, pageLocation) {

                pageLocation.search = `?box=${encodeURIComponent(boxId)}`;
                // we will now include "?box=commentbox" in the box URL
                //pageLocation.hash = boxId; leave the hash alone
                return pageLocation.href; // return url string
            }
        });
        Events.scrollEvent.register('begin', function(to, element) {
            console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function(to, element) {
            console.log("end", arguments);
        });

        scrollSpy.update();

    }

    scrollTo(place) {
        scroller.scrollTo('scroll-to-'+place, {
            duration: 800,
            delay: 0,
            smooth: 'easeOutQuart'
        })
    }

    onRef = (ref) => {
        this.line_ellipsis = ref
    };

    get_arrow(){
        if (!this.state.loaded) {
            // console.log("isClamped1");
            // console.log(this.line_ellipsis.isClamped());
            return <></>;
        }
        if (this.state.check_arrow===0){
            // console.log("isClamped1");
            // console.log(this.line_ellipsis.isClamped());
            this.setState({check_arrow: 1});
            return <></>
        }
        if (this.state.check_arrow===1){
            // console.log("isClamped2");
            // console.log(this.line_ellipsis.isClamped());
            this.setState({check_arrow: 2, show_arrow: this.line_ellipsis.isClamped()});
            return <></>
        }
        // console.log("isClamped3");
        // console.log(this.line_ellipsis.isClamped());
        // console.log(this.state.show_arrow);
        if (!this.state.show_arrow){
            return <></>
        }
        else {
            if (this.state.max_line===6){
                return (<a className="test1" to="test1" onClick={() => this.scrollTo('element')} >
                    <FaChevronDown onClick={()=>this.setState({max_line: 10000})}/>
                </a>)
            }
            else{
                return (<a className="test1" to="test1" onClick={() => this.scrollTo('top')} >
                    <FaChevronUp onClick={()=>this.setState({max_line: 6})}/>
                </a>)
            }
        }
    }

    componentWillUnmount() {
        this.removeCommentBox();
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }

    componentWillReceiveProps(newProps){
        this.get_detail(newProps.source, newProps.id);
    }

    render() {
        let detail_content = (
            <Container>
                <Row>
                    <Col>
                        <Card className={'detail_card'}>
                            <Element name="scroll-to-top" className="element">
                                {/*Scroll to element*/}
                            </Element>
                            <Card.Title className='detail_title'>
                                <span className='detail_title'>{this.state.title}</span>
                            </Card.Title>
                            <Card.Text>
                                <Container>
                                    <Row>
                                        <Col className='detail_date' xs={6} sm={8} md={9} lg={10}>{this.state.date}</Col>
                                        <Col xs={6} sm={4} md={3} lg={2}>
                                            <div className='detail_share'>
                                                <FacebookShareButton url={this.state.url} hashtag="#CSCI571">
                                                    <FacebookIcon size={24} round={true} data-tip='Facebook' data-place='top'/>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={this.state.url} hashtags={["CSCI571"]}>
                                                    <TwitterIcon size={24} round={true} data-tip='Twitter' data-place='top'/>
                                                </TwitterShareButton>
                                                <EmailShareButton url={this.state.url}>
                                                    <EmailIcon size={24} round={true} data-tip='Email' data-place='top'/>
                                                </EmailShareButton>
                                            </div>
                                            <div className='detail_bookmark'>
                                                {this.state.saved?
                                                    <MdBookmark className="bookmark" onClick={this.changeSave} data-tip='Bookmark'
                                                                data-place='top' />:
                                                    <FiBookmark className="bookmark" onClick={this.changeSave} data-tip='Bookmark'
                                                                data-place='top' />}
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Text>
                            <Card.Img src={this.state.image}/>

                            <Card.Text >
                                <MyLinesEllipsis
                                    text={this.state.description}
                                    maxLine={this.state.max_line}
                                    ellipsis='...'
                                    trimRight
                                    basedOn='words'
                                    onRef={this.onRef}
                                />

                            </Card.Text>
                            <Element name="scroll-to-element" className="element">
                                {/*Scroll to element*/}
                            </Element>

                                <div className={'my_float_right'}>
                                    {this.get_arrow()}
                                </div>
                        </Card>
                    </Col>
                </Row>
            </Container>);
        return (
            <>
                <div className='loader_position'>
                    <div className='loader_position2'>
                        <Loader
                            size={50}
                            color={"#123abc"}
                            loading={!this.state.loaded}
                            // loading={true}
                        />
                    </div>
                    {this.state.loaded? (<></>): "Loading"}
                </div>
                <div className={this.state.loaded? '': 'my_invisible'}>
                    {detail_content}
                    <div className="commentbox">

                    </div>
                </div>
            </>
        );
    }
}


class MainNav extends React.Component {
  constructor(props) {
        super(props);
        this.state = {as_input: [], open: false, df_value:'' };
        this.section_match = {"#home": "Home", "#world": "World","#politics": "Politics","#business": "Business",
                            "#technology": "Technology", "#sport": "Sports"};
        this.handleInputChange = this.handleInputChange.bind(this);
      this.handleChange = this.handleChange.bind(this);

      // 'https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=' ,"b16660b1b578470f84924c78d8f7a02a"
        this.promiseOptions = _.debounce(inputValue => fetch('https://hw8expensive.cognitiveservices.azure.com/bing/v7.0/suggestions?q=' + inputValue,
            {headers: {"Ocp-Apim-Subscription-Key": "36cad5f22ded471d851b97bd80a239f7"}})
                .then(response => response.json())
                .then(function(response){
                    if (inputValue ==='') return [];
                    const resultsRaw = response.suggestionGroups[0].searchSuggestions;
                    // console.log(resultsRaw.map(result => ({value: result.displayText, label: result.displayText})));
                    return resultsRaw.map(result => ({value: result.displayText, label: result.displayText}))
                })
            , 10, {
                leading: true
            });
      // this.promiseOptions = _.debounce(inputValue => fetch('https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=' + inputValue,
      //     {headers: {"Ocp-Apim-Subscription-Key": "b16660b1b578470f84924c78d8f7a02a"}})
      //         .then(response => response.json())
      //         .then(function(response){
      //             if (inputValue ==='') return [];
      //             const resultsRaw = response.suggestionGroups[0].searchSuggestions;
      //             // console.log(resultsRaw.map(result => ({value: result.displayText, label: result.displayText})));
      //             return resultsRaw.map(result => ({value: result.displayText, label: result.displayText}))
      //         })
      //     , 1000, {
      //         leading: true
      //     });
}

  handleInputChange(new_value){
      return new_value
  };

  handleChange(new_value){
      this.props.selectHandler(new_value);
      this.setState({df_value: new_value})
  }

  render() {
      // console.log("nav render");
      // console.log(this.props.section);

      const lg_navbar = (<Navbar className="bg_color" bg="dark" variant="dark">
          <NavItem>
              <AsyncSelect
                  className='as'
                  cacheOptions
                  loadOptions={this.promiseOptions}
                  defaultOptions
                  onInputChange={this.handleInputChange}
                  onChange={this.handleChange}
                  placeholder={"Enter keyword..."}
                  noOptionsMessage={()=>"No match"}
                  defaultInputValue = {this.state.df_value}
              />
          </NavItem>
          <Nav className="mr-auto " activeKey={this.props.section}>
              <Nav.Link href={'#home'} eventKey='home'>Home</Nav.Link>
              <Nav.Link href={'#world'} eventKey='world'>World</Nav.Link>
              <Nav.Link href={'#politics'} eventKey='politics'>Politics</Nav.Link>
              <Nav.Link href={'#business'} eventKey='business'>Business</Nav.Link>
              <Nav.Link href={'#technology'} eventKey='technology'>Technology</Nav.Link>
              <Nav.Link href={'#sport'} eventKey='sport'>Sports</Nav.Link>
          </Nav>
          <NavItem>
              <a href={"#bookmark"}>
                  <ReactTooltip effect='solid' className="tool_tip_my"/>

                  {this.props.section==='bookmark'?
                      <MdBookmark className="bookmark bookmark_off" data-tip='Bookmark'
                                  data-place='bottom' />:
                      <FiBookmark className="bookmark bookmark_off" data-tip='Bookmark'
                                  data-place='bottom' />}

              </a>
          </NavItem>
          <NavItem>
              {this.props.showSwitch ?
                  (<span>
                        <span className='switch_text'>NYTimes</span>
                        <NGSwitch onChange={this.props.switchHandler} checked={this.props.checked} uncheckedIcon={false}
                                  checkedIcon={false} onColor="#56a3ff" onHandleColor="#ffffff" handleDiameter={20}
                                  height={22} width={40} offColor="#cccccc" className='switch_position_my'/>
                        <span className='switch_text'>Guardian</span>
                    </span>)
                  :<span/>}
          </NavItem>
      </Navbar>);

      const sm_navbar = (
          <Navbar className="bg_color flow_col" bg="dark" variant="dark">
              <div className={'flow_row'}>
                  <AsyncSelect
                      className='as'
                      cacheOptions
                      loadOptions={this.promiseOptions}
                      defaultOptions
                      onInputChange={this.handleInputChange}
                      onChange={this.props.selectHandler}
                      placeholder={"Enter keyword..."}
                      noOptionsMessage={()=>"No match"}
                  />
                  <div  className={'nav_button_div'}>
                  <Button onClick={() => this.setState({open: !this.state.open})} aria-controls="example-collapse-text"
                          aria-expanded={this.state.open} className={'nav_button'}> <FiMenu/> </Button>
                  </div>
              </div>
              <Collapse in={this.state.open}>
                  <div id="example-collapse-text" className={'sm_nav_box'}>
                      <Nav className="mr-auto flow_col" activeKey={this.props.section}>
                          <Nav.Link href={'#home'} eventKey='home'>Home</Nav.Link>
                          <Nav.Link href={'#world'} eventKey='world'>World</Nav.Link>
                          <Nav.Link href={'#politics'} eventKey='politics'>Politics</Nav.Link>
                          <Nav.Link href={'#business'} eventKey='business'>Business</Nav.Link>
                          <Nav.Link href={'#technology'} eventKey='technology'>Technology</Nav.Link>
                          <Nav.Link href={'#sport'} eventKey='sport'>Sports</Nav.Link>
                      </Nav>
                      <a href={"#bookmark"}>
                          <ReactTooltip effect='solid' className="tool_tip_my"/>

                          {this.props.section==='bookmark'?
                              <MdBookmark className="bookmark bookmark_off sm_nav_box_border" data-tip='Bookmark'
                                          data-place='bottom' />:
                              <FiBookmark className="bookmark bookmark_off sm_nav_box_border" data-tip='Bookmark'
                                          data-place='bottom' />}

                      </a>
                      {this.props.showSwitch ?
                          (<div>
                                <div className='switch_text'>NYTimes</div>
                                <NGSwitch onChange={this.props.switchHandler} checked={this.props.checked} uncheckedIcon={false}
                                          checkedIcon={false} onColor="#56a3ff" onHandleColor="#ffffff" handleDiameter={20}
                                          height={22} width={40} offColor="#cccccc" className='switch_position_my sm_nav_box_border'/>
                                <div className='switch_text'>Guardian</div>
                            </div>)
                          :<span/>}
                  </div>
              </Collapse>
          </Navbar>);

    return (
        <>
            <MediaQuery minWidth={960} >
                {lg_navbar}
            </MediaQuery>
            <MediaQuery maxWidth={959}>
                {sm_navbar}
            </MediaQuery>
        </>
    );
  }
}


class SectionPage extends React.Component{
    constructor(props) {
        super(props);
        // console.log(this.props); TODO fill all state
        if (this.props.location.pathname.substring(1)===''){
            window.location.href = '#home';
        }
        // store.clear();
        let source;
        console.log(store.keys());
        if (store.has('source')){
            console.log('has source');
            console.log(store('source'));
            source = store('source');
        }
        else{
            source = 'g';
        }
        let checked = true;
        let showSwitch = true;
        if (this.props.location.search.substring(4).indexOf('nytimes') >= 0){
            source = 'n';
        }
        if (this.props.location.pathname.substring(1) ===  'detail' ||
            this.props.location.pathname.substring(1) ===  'bookmark'){
            showSwitch = false;
        }
        if (source==='n'){
            checked = false;
        }
        this.state = { section: this.props.location.pathname.substring(1), source: source , checked: checked,
            showSwitch: showSwitch, id: this.props.location.search.substring(4)};
        store('source', source);
        // console.log(store.keys());
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.handleSelectChange= this.handleSelectChange.bind(this);
        this.updateSource= this.updateSource.bind(this);
    }

    handleSwitchChange(checked) {
        // console.log("change");
        // console.log(checked);
        if (checked){
            this.setState({checked: checked, source: 'g'});
            store('source', 'g')
        }
        else{
            this.setState({checked: checked, source: 'n'});
            store('source', 'n')
        }
    }

    handleSelectChange(newValue){
        // alert(newValue);
        window.location.href = '#search';
        // console.log('select change');
        // console.log(newValue);
        this.setState({ section: 'search', q: newValue.value});
        return newValue;
    };

    updateSource(new_source){
        this.setState({source: new_source});
        store('source', new_source);
    }

    componentWillReceiveProps(newProps){
        // console.log("page update:");
        // console.log(newProps.location);
        if (newProps.location.pathname !== '/detail' && newProps.location.pathname !== '/bookmark'){
            this.setState({ section: newProps.location.pathname.substring(1), showSwitch: true});
        }
        else{
            this.setState({ section: newProps.location.pathname.substring(1), showSwitch: false,
                                  id: newProps.location.search.substring(4)});
        }
    }

    render() {
        // console.log("page render");
        // console.log(this.state.section);
        if (this.state.section === 'search'){
            return (
                <div>
                    <MainNav section={this.state.section} switchHandler={this.handleSwitchChange}
                             checked={this.state.checked} selectHandler={this.handleSelectChange}
                             showSwitch={this.state.showSwitch}/>
                    <SearchBody source={this.state.source} q={this.state.q}/>
                </div>
            );
        }
        if (this.state.section === 'detail'){
            return (
                <div>
                    <ToastContainer position="top-center"
                                    autoClose={2500}
                                    hideProgressBar
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnVisibilityChange
                                    draggable
                                    pauseOnHover
                                    transition={Zoom}
                                    toastClassName={'toast_text'}/>
                    <MainNav section={this.state.section} switchHandler={this.handleSwitchChange}
                             checked={this.state.checked} selectHandler={this.handleSelectChange}
                             showSwitch={this.state.showSwitch}/>
                    <DetailBody source={this.state.source} id={this.state.id}/>
                </div>
            );
        }
        if (this.state.section === 'bookmark'){
            return (
                <div>
                    <ToastContainer position="top-center"
                                    autoClose={2500}
                                    hideProgressBar
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnVisibilityChange
                                    draggable
                                    pauseOnHover
                                    transition={Zoom}
                                    toastClassName={'toast_text'}/>
                    <MainNav section={this.state.section} switchHandler={this.handleSwitchChange}
                             checked={this.state.checked} selectHandler={this.handleSelectChange}
                             showSwitch={this.state.showSwitch}/>
                    <BookmarkBody source={this.state.source} id={this.state.id} updateSource={this.updateSource}/>
                </div>
            );
        }
        return (
            <div>
                <MainNav section={this.state.section} switchHandler={this.handleSwitchChange}
                         checked={this.state.checked} selectHandler={this.handleSelectChange}
                         showSwitch={this.state.showSwitch}/>
                <SectionBody section={this.state.section} source={this.state.source}/>
            </div>
        );
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        // console.log('APP construct')
    }

    render() {
        // console.log("app render");
        return (
            <Switch>
                <Route path="/" component={SectionPage} exact />
                <Route path="/home" component={SectionPage} />
                <Route path="/world" component={SectionPage} />
                <Route path="/politics" component={SectionPage} />
                <Route path="/business" component={SectionPage} />
                <Route path="/technology" component={SectionPage} />
                <Route path="/sport" component={SectionPage} />
                <Route path="/search" component={SectionPage} />
                <Route path="/detail" component={SectionPage} />
                <Route path="/bookmark" component={SectionPage} />
                <Route component={Error} />
            </Switch>
        );
    }
}

export default App;
