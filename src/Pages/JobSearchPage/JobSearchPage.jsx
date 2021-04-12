import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import Select from 'react-select';
import {Form, Button, ListGroup, Card, Pagination} from 'react-bootstrap';
import './JobSearch.css'
import JobCard from './JobCard'
import {LocationPicker} from '@/_components';
import {userService} from '@/_services';
import paginate from 'jw-paginate';

const styles = {
  control: base => ({
    ...base,
    minHeight: 36
  }),
  dropdownIndicator: base => ({
      ...base,
      padding: 4,
      zIndex: 1
  }),
  clearIndicator: base => ({
      ...base,
      padding: 4
  }),
  multiValue: base => ({
      ...base,
      backgroundColor: variables.colorPrimaryLighter
  }),
  valueContainer: base => ({
      ...base,
      padding: '0px 6px'
  }),
  input: base => ({
      ...base,
      margin: 0,
      padding: 0,
  }),
  container: base => ({
    ...base,
    flex: 1
  })
};

const quantityOptions = [5, 10, 20, 30];

class JobSearchPage extends React.Component{
  constructor(props){
    super(props);

    const searchParams = new URLSearchParams(this.props.location.search);

    this.state = {
      quantity: 5,
      paginateObject: null,
      country: searchParams.has("country") ? searchParams.get("country") : '',
      state: searchParams.has("state") ? searchParams.get("state") : '',
      city: searchParams.has("city") ? searchParams.get("city") : '',
      search: searchParams.has("search") ? searchParams.get("search") : '',
      prevSearch: '',
      jobPosts: []
    }
    this.setQuantityOptions = this.setQuantityOptions.bind(this);
    this.setLocationFieldValue = this.setLocationFieldValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAndSetQueryParams = this.handleChangeAndSetQueryParams.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }

  componentDidMount(){
    this.submitSearch();
  }

  setQuantityOptions(quantity){
    this.setState((prevState) => {
      let paginateResult = paginateResult = paginate(prevState.jobPosts.length, 1, quantity);
      return{
        quantity: quantity,
        paginateObject: paginateResult
      }
    })
  }

  setLocationFieldValue(selector, value){
    if(selector === 'country'){
      this.setState({
        country: value,
        state: '',
        city: ''
      })
    }else if(selector === 'state'){
      this.setState({
        state: value,
        city: ''
      })
    }else{
      this.setState({
        city: value
      })
    }
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleChangeAndSetQueryParams(e) {
    this.handleChange(e);
    const params = new URLSearchParams(this.props.location.search);

    if(e.target.value) {
      params.set(e.target.name, e.target.value);
    } else {
      params.delete(e.target.name);
    }
    this.props.history.push({search: params.toString()})
  }

  submitSearch(){
    userService.searchJobPost(this.state.search, this.state.country, this.state.state, this.state.city)
               .then(data => {
                 this.setState((prevState) => {
                  let paginateResult = paginate(data.length, 1, prevState.quantity);
                   return {
                             jobPosts: data,
                             prevSearch: prevState.search,
                             currentPage: 1,
                             paginateObject: paginateResult
                           }
                 })
               })
               .catch(()=>{
                 alert("Unable to search job posts. Please try again.");
               });
  }

  handlePaginationChange(page){
    this.setState((prevState) => {
      let paginateResult;
      switch(page){
        case "first":
          paginateResult = paginate(prevState.jobPosts.length, 1, prevState.quantity);
          break;
        case "prev":
          paginateResult = paginate(prevState.jobPosts.length, prevState.paginateObject.currentPage - 1, prevState.quantity);
          break;
        case "next":
          paginateResult = paginate(prevState.jobPosts.length, prevState.paginateObject.currentPage + 1, prevState.quantity);
          break;
        case "last":
          paginateResult = paginate(prevState.jobPosts.length, prevState.jobPosts.length, prevState.quantity);
          break;
        default:
          paginateResult = paginate(prevState.jobPosts.length, page, prevState.quantity)
      }
      return{
        paginateObject: paginateResult
      }
    })
  }

  render(){


    return(
      <div className="job-search-page mx-auto">
        <h3 className="job-search-page-title">Search Jobs</h3>
        <Form className="job-search-page-search-container">
          <Form.Group>
            <Button variant="primary" onClick={this.submitSearch}>Search Jobs</Button>
            <Form.Control name="search" onChange={this.handleChangeAndSetQueryParams} type="text" placeholder="Search job title or company" value={this.state.search}/>

            <LocationPicker setFieldValue={this.setLocationFieldValue} country={this.state.country} state={this.state.state} city={this.state.city} location={this.props.location} history={this.props.history}>
            {({countryOptions, stateOptions, cityOptions, country, state, city, handleChange}) => (
              <div className="location-selector-container">
                <div className="select-wrapper">
                  <Select name="country" options={countryOptions} value={country} onChange={handleChange} placeholder="Country" styles={styles} />
                </div>
                <div className="select-wrapper">
                  <Select name="state" options={stateOptions} value={state} onChange={handleChange} placeholder="State" styles={styles} />
                </div>
                <div className="select-wrapper">
                  <Select name="city" options={cityOptions} value={city} onChange={handleChange} placeholder="City" styles={styles} />
                </div>
              </div>
            )}
            </LocationPicker>
          </Form.Group>
        </Form>

        <div>
          <div className="job-results">
            <span className="job-results-quantity">
              {this.state.prevSearch === "" && <React.Fragment><b>{this.state.jobPosts.length}</b> available jobs</React.Fragment>}
              {this.state.prevSearch !== "" && <React.Fragment><b>{this.state.jobPosts.length}</b> jobs found for <b>"{this.state.prevSearch}"</b></React.Fragment>}
            </span>
            <span className="job-results-quantity-select">
              Results per page: {quantityOptions.map(option =>
                  (<span key={option}>
                    {this.state.quantity !== option ?
                      (<a onClick={()=>{
                        this.setQuantityOptions(option);
                      }}>{option}
                      </a>) :
                      option
                    }
                  </span>)
              )}
            </span>
          </div>

          <div className="job-container">
            {this.state.paginateObject !== null &&
             this.state.jobPosts.slice(this.state.paginateObject.startIndex, this.state.paginateObject.endIndex + 1)
                                .map(jobPost => {
                                    const jobAddress = jobPost.jobAddresses.length ? jobPost.jobAddresses[0] : null;
                                    const state = jobAddress ? jobAddress.state : "";
                                    const city = jobAddress ? jobAddress.city : "";

                                    return <JobCard
                                            key={jobPost.id}
                                            jobId={jobPost.id}
                                            title={jobPost.title}
                                            positionType={jobPost.positionType}
                                            companyName={jobPost.companyName}
                                            datePublished={jobPost.datePublished}
                                            description={jobPost.description}
                                            state={state}
                                            city={city}
                                            bookmarked={jobPost.bookmarked}
                                            applied={jobPost.applied}
                                            />
                                  })
            }
          </div>
          <Pagination size="md">
            <Pagination.First onClick={()=>{this.handlePaginationChange('first')}}/>
            <Pagination.Prev onClick={()=>{this.handlePaginationChange('prev')}}/>
            {this.state.paginateObject !== null && this.state.paginateObject.pages.map(paginateIndex => (
              <Pagination.Item key={paginateIndex} active={paginateIndex === this.state.paginateObject.currentPage} onClick={()=>{this.handlePaginationChange(paginateIndex)}}>
                {paginateIndex}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={()=>{this.handlePaginationChange('next')}}/>
            <Pagination.Last onClick={()=>{this.handlePaginationChange('last')}}/>
          </Pagination>
        </div>
      </div>
    )
  }
}

export {JobSearchPage}
