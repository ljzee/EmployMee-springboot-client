import React from 'react';
import csc from 'country-state-city';
import Select from 'react-select'

class LocationPicker extends React.Component{
  constructor(props){
    super(props);

    let countryOptions = csc.getAllCountries().map(country=>({label: country.name, value: country.isoCode}));
    let selectedCountryOption = this.props.hasOwnProperty("country") ?
                                    countryOptions.find(option => option.label === this.props.country) :
                                    null;
    let stateOptions = [];
    let selectedStateOption = null;
    if(selectedCountryOption) {
      stateOptions = csc.getStatesOfCountry(selectedCountryOption.value).map(state=>({label: state.name, value: state.isoCode}));
      selectedStateOption = this.props.hasOwnProperty("state") ?
        stateOptions.find(option => option.label === this.props.state) :
        null;
    }

    let cityOptions = [];
    let selectedCityOption = null;
    if(selectedCountryOption && selectedStateOption) {
      cityOptions = csc.getCitiesOfState(selectedCountryOption.value, selectedStateOption.value).map(city=>({label: city.name, value: city.name}));
      selectedCityOption = this.props.hasOwnProperty("city") ?
        cityOptions.find(option => option.label === this.props.city) :
        null;
    }

    this.state = {
      countryOptions: countryOptions,
      stateOptions: stateOptions,
      cityOptions: cityOptions,
      country: selectedCountryOption,
      state: selectedStateOption,
      city: selectedCityOption
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(option, event){
    const params = new URLSearchParams(this.props.location.search);

    if(event.name === "country"){
      this.props.setFieldValue("country", option.label);
      this.setState({
        country: option,
        stateOptions: csc.getStatesOfCountry(option.value).map(state=>({label: state.name, value: state.isoCode})),
        cityOptions: [],
        state: null,
        city: null
      });

      params.set("country", option.label);
      params.delete("state");
      params.delete("city");
      this.props.history.push({search: params.toString()});
    }

    if(event.name === "state"){
      this.props.setFieldValue("state", option.label);
      this.setState({
        state: option,
        cityOptions: csc.getCitiesOfState(this.state.country.value, option.value).map(city=>({label: city.name, value: city.name})),
        city: null
      });

      params.set("state", option.label);
      params.delete("city");
      this.props.history.push({search: params.toString()});
    }

    if(event.name === "city"){
      this.props.setFieldValue("city", option.label);
      this.setState({
        city: option
      });

      params.set("city", option.label);
      this.props.history.push({search: params.toString()});
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
