import React from 'react';
import csc from 'country-state-city';
import Select from 'react-select'

class LocationPicker extends React.Component{
  constructor(props){
    super(props);


    this.state = {
      countryOptions: csc.getAllCountries().map(country=>({label: country.name, value: country.isoCode})),
      stateOptions: [],
      cityOptions: [],
      country: null,
      state: null,
      city: null
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(option, event){
    if(event.name === "country"){
      this.props.setFieldValue("country", option.label);
      this.setState({
        country: option,
        stateOptions: csc.getStatesOfCountry(option.value).map(state=>({label: state.name, value: state.isoCode})),
        cityOptions: [],
        state: null,
        city: null
      })
    }

    if(event.name === "state"){
      this.props.setFieldValue("state", option.label);
      this.setState({
        state: option,
        cityOptions: csc.getCitiesOfState(this.state.country.value, option.value).map(city=>({label: city.name, value: city.name})),
        city: null
      })
    }

    if(event.name === "city"){
      this.props.setFieldValue("city", option.label);
      this.setState({
        city: option
      })
    }
  }

  render(){
    const {children} = this.props;
    return children({
      countryOptions: this.state.countryOptions,
      stateOptions: this.state.stateOptions,
      cityOptions: this.state.cityOptions,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      handleChange: this.handleChange
    })
  }
}

export {LocationPicker};
