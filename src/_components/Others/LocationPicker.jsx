import React from 'react';
import csc from 'country-state-city';
import Select from 'react-select'

class LocationPicker extends React.Component{
  constructor(props){
    super(props);


    this.state = {
      countryOptions: csc.getAllCountries().map(country=>({label: country.name, value: country.id})),
      regionOptions: [],
      cityOptions: [],
      country: null,
      region: null,
      city: null
    }

    //console.log(this.props)
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(option, event){

    if(event.name === "country"){
      this.props.setFieldValue("country", option.label);
      this.setState({
        country: option,
        regionOptions: csc.getStatesOfCountry(option.value).map(state=>({label: state.name, value: state.id})),
        cityOptions: [],
        region: null,
        city: null
      })
    }

    if(event.name === "region"){
      this.props.setFieldValue("region", option.label);
      this.setState({
        region: option,
        cityOptions: csc.getCitiesOfState(option.value).map(city=>({label: city.name, value: city.id})),
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
      regionOptions: this.state.regionOptions,
      cityOptions: this.state.cityOptions,
      country: this.state.country,
      region: this.state.region,
      city: this.state.city,
      handleChange: this.handleChange
    })
  }
}

export {LocationPicker};
/*
<Select
  value={this.state.country}
  onChange={this.handleChange}
  options={this.state.countryOptions}
  name="country"
/>
<Select
  value={this.state.region}
  onChange={this.handleChange}
  options={this.state.regionOptions}
  name="region"
/>
<Select
  value={this.state.city}
  onChange={this.handleChange}
  options={this.state.cityOption}
  name="city"
/>
*/
