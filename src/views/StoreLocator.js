import React, {useState, useEffect} from "react";
import {Grid, Typography, Container, Paper, Link } from "@material-ui/core";
import FilterMap from '../components/FilterMap';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId, geocodeByAddress  } from 'react-google-places-autocomplete';
import {makeStyles} from '@material-ui/styles';
import clsx from 'clsx';
import SearchIcon from '@material-ui/icons/Search';
// import { compose, withProps } from "recompose";
// import SearchLocationInput from '../components/SearchLocationInput';

const useStyles = makeStyles(theme => ({
  root:{
    fontSize:'16px',
    fontFamily: 'Source Sans Pro,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif'
  },

  paperRoot:{
    border:'solid 2px lightgrey',
    marginBottom: '5px',
    borderRadius: '8px',
    padding:'8px',
    '&:hover':{
      borderColor:'skyblue'
    }
  },

  filterNavigation:{
    display:'flex',
    justifyContent:'flex-end'
  },
  filterWidget:{
    paddingLeft:'10px',
    lineHeight:'22px',
    display:'inline-block'
  },
  filterWidgetIcon:{
    display:'inline-block',
    padding:'10px'
  },
  filterWidgetText:{
    display:'inline-block',
    padding:'20px',
    cursor:'pointer',
    color:'#0088ce'
  },
  filterWidgetActiveText:{
    color:'#768b95 !important'
  },
  filter_title:{
    textAlign:'center'
  },
  dealer_locator_card:{
    fontSize: '18px',
    cursor: 'pointer',
    lineHeight: '30px'
  },
  icon_location: {
    fontFamily: 'icomoon!important',
    speak: 'none',
    fontStyle: 'normal',
    fontWeight: 400,
    fontVariant: 'normal',
    textTransform: 'none',
    lineHeight: 1,
    "&:before":{
      content: "\e90d"
    }
  }
}));

// 
const radiusForSearch = 50;//miles

// get the distance difference between 2 location, its unit is mile
function haversine_distance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.latitude * (Math.PI/180); // Convert degrees to radians
  var rlat2 = mk2.latitude * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (mk2.longitude-mk1.longitude) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}

function StoreLocator() {
  const [rows, setRows] = useState([]);
  const [searchLocation, setSearchLocation] = useState(null);
  const [data, setData]=useState([]);
  const [showSpringFree, setShowSpringFree] = useState(true);
  const [showDealer, setShowDealer] = useState(true);
  const [filteredData, setFilteredData]=useState([]);
  const classes = useStyles();
  
  useEffect(() => {
    
    if(rows && rows.value){
      console.log('value', rows.value.place_id);

      // ********************************************************
      // set the static search location as result for the testing purpose
      //********************************************************
      setSearchLocation({latitude: "30.571905", longitude: "-96.298820",})

      geocodeByPlaceId(rows.value.place_id)
      .then(results => {
        console.log(results);
        if(results[0])
          setSearchLocation(results[0]);
      })
      .catch(error => console.error(error));

      // geocodeByAddress('Montevideo, Uruguay')
      // .then(results => console.log(results))
      // .catch(error => console.error(error));
    }
  },[rows]);

  useEffect(() => {
    console.log('search location', searchLocation)
    if(searchLocation !== null){
      var tempArr = []
      tempArr = data.filter((item, index) => 
         haversine_distance(searchLocation, {latitude:item.latitude, longitude:item.longitude} ) < radiusForSearch)

      // console.log('tempArr', tempArr)  
      setFilteredData(tempArr);
    }
  }, [searchLocation, data]);

  useEffect(()=>{
    getData()
  },[])

  const getData=()=>{
    fetch('dealer-locators.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setData(myJson);
        setFilteredData(myJson)
      });
  }

  const toggleSpringFree = () => {
    setShowSpringFree(!showSpringFree)
  }

  const toggleDealer = () => {
    setShowDealer(!showDealer)
  }

  return (
    <Container className={classes.root}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={8}>
          <Typography variant="h4" align="center">
            The World’s Safest Trampoline Is Available Nationwide
          </Typography>
          <Typography variant="h5" align="center">
            Find A Store Near You
          </Typography>
        </Grid>    
      </Grid>
      <Grid container alignItems="center">
        
        <Grid item xs={5} >
          <GooglePlacesAutocomplete
            selectProps={{
              placeholder: 'Enter your zip code or address',
              rows,
              onChange: setRows,
              styles: {
                input: (provided) => ({
                  ...provided,
                  color: 'blue',
                  
                }),
                option: (provided) => ({
                  ...provided,
                  color: 'blue',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'blue',
                }),
                control:(provided) => ({
                  ...provided,
                  borderRadius:'8px'
                })
              },
            }}
          />
        {/* <SearchLocationInput /> */}
        </Grid>
        <Grid item xs={7} >
            <div className={classes.filterNavigation}>
              <div className={classes.filterWidget}>
                <div className={classes.filterWidgetIcon}>
                  <img src="image/b1.png" style={{verticalAlign: 'baseline'}} alt="springfree" /> 
                </div>
                <div 
                  className={showSpringFree ? classes.filterWidgetText : clsx(classes.filterWidgetText, classes.filterWidgetActiveText)} 
                  onClick={()=>toggleSpringFree()}
                >
                  {showSpringFree ? 'HIDE' : 'SHOW'} <br/>SPRINGFREE <br/>SHOWROOMS
                </div>
              </div>
              <div className={classes.filterWidget}>
                <div className={classes.filterWidgetIcon}>
                  <img src="image/p1.png" style={{verticalAlign: 'baseline'}} alt="authorize" /> 
                </div>
                <div 
                  className={showDealer ? classes.filterWidgetText : clsx(classes.filterWidgetText, classes.filterWidgetActiveText)} 
                  onClick={() => toggleDealer()}
                >
                  {showDealer ? 'HIDE' : 'SHOW'} <br/>AUTHORIZED <br/>DEALERS
                </div>
              </div>
            </div>
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={6} style={!searchLocation ? {display:'none'} : {display:'block'}} >
          {
            filteredData.length ? 
            <>
              <Typography variant="h5">Search Results: ( {filteredData.length} found)</Typography>
              {
                filteredData.map((item, index) => {
                  return (
                  <Paper key={item.dealer_id} variant="outlined" className={classes.paperRoot}>
                    <div className={classes.filter_title}>
                      <Link class="">
                        <img src="image/p1.png" style={{verticalAlign: 'baseline', height: '18px'}} alt="springfree"/> 
                        <strong><span>{item.dealer_name}</span></strong>
                      </Link>
                    </div>
                    <Grid container >
                      <Grid item xs={6}>
                        <div className={classes.dealer_locator_card}>
                          <span className={classes.icon_location}></span>
                          {item.dealer_address}
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={classes.dealer_locator_card}>
                          <span className={classes.icon_share}></span>
                          <Link href={item.dealer_url} target="_blank" >Visit Website</Link>
                        </div>

                      </Grid>

                    </Grid>
                    
                  </Paper>
                  )
                })
              }
            </>
            :
            <></>
          }
        </Grid>
        <Grid item xs={!searchLocation ? 12 : 6}>
          <FilterMap data={filteredData} searchValue={searchLocation} showDealer={showDealer} showSpringFree={showSpringFree} />
        </Grid>
      </Grid>
    </Container>  
  );
}

export default StoreLocator;
