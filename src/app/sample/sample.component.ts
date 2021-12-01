import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  
} from '@angular/core';
// import { ServiceService } from 'src/app/service.service';

import Map from 'ol/Map';
import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { BingMaps, OSM, Stamen, XYZ } from 'ol/source';
import { Layer, Tile as TileLayer, Vector as VectorLayer, VectorImage } from 'ol/layer';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import DragBox from 'ol/interaction/DragBox';
import Interaction from 'ol/interaction/Interaction';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults, FullScreen, MousePosition, OverviewMap } from 'ol/control';
import ImageLayer from 'ol/layer/Image';

// import coordinates from '../../layerdata/osm-world-airports.json';
import GeometryType from 'ol/geom/GeometryType';
import { add, Coordinate } from 'ol/coordinate';
import { Parser } from '@angular/compiler/src/ml_parser/parser';
// import { ServiceService } from 'src/app/service.service';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { style } from '@angular/animations';
import { Icon, Style , Circle as CircleStyle, Fill, Stroke,} from 'ol/style';
import { features } from 'process';
import { isEmpty } from 'ol/extent';
import {UserService} from '../user.service';
import MultiPoint from 'ol/geom/MultiPoint';
import {gql, Apollo} from 'apollo-angular';
import { Source } from 'graphql';
import { xml2json } from 'xml-js';
import Static from 'ol/source/ImageStatic';
import { transform,transformExtent} from 'ol/proj';
import Projection from 'ol/proj/Projection';

import {getCenter} from 'ol/extent';
import { prepareSyntheticListenerFunctionName } from '@angular/compiler/src/render3/util';



// import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

 const getZonesDetails = gql`
query($id :ID!){
  zonesActionZones(installationId :$id)
  {
     shape
      actionZoneType
      alertsPriority
  }
}
 `

const getWorkDetails = gql`
query($id :ID!) 
{ 
   zonesWorkZones(installationId: $id) 
   { 
     shape
   } 
}`


 const courseImage = gql`
query($id :ID!) 
{ 
installationContents(installationId:$id) 
{ 
installationId 
installationContentFnvId 
  } 
} 
`

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {
  map: any;
  draw: any;
  value: any;
  binding: any;
  dragSource: any;
  coordinatesArray: any = [];
  result : any =[]
  // data: any = this.countryList;
  coordinates : any =[]
  latitude1:any;
  longitude1:any;
  latitude2:any;
  longitude2:any;
  zoomLat:any;
zoomLng:any;
courseLngLat : any =[]
  @ViewChild('popupCoordinates') popupCoordinates!: ElementRef;
  data: any;
  marker: any;
  coords: any;
  lat!: number;
  lng!: number;
  clickMouse : any;
  info: boolean = true;
  clickedCordinates: any;
  popup!: Overlay;
  coordinatesarr : any;
  dummy : any =[];
  boundsData : any;
  bounds : any;
  tempZones : any=[];
  dataBounds : any=[];
  drawSource : any;
  drawLayer : any;
  test : any =[];
  installation_Id : any;
  zoneValue : any;
  sampleData1 : any =[]
  sampleData : any =[]
//layer : VectorLayer;
geojsonObject : any;
instId : any;
courseImageData : any =[]
  staticImageLayer: any;


  courseimageId1 : any;
  courseimageId : any;
  instContFnvId : any;
  hashId : any;
  imageUrl : any;
   stylepolygon : any =[];
  constructor(private service: UserService,private apollo: Apollo) { 
  }

  ngOnInit(): void {
 
  this.zoneValue = "";
  // //alert(this.zoneValue)
  }  
  ngAfterViewInit(): void {
   this.installation_Id = '';
    this.service.getMouseValue().subscribe(response=>{
      ////console.log(response);
      this.clickMouse = response;
      if(this.clickMouse == 1)
      {
        ////console.log("enter");
        
      this.initilizeMap(); 
      }
    })
//  *****************************     Getting Map Coordinates Data  ************************* 
    this.service.getMapcoordinates().subscribe(data=>{
    
      this.zoneValue = "";
 
      //alert(this.test)
      this.result = data;
      //////console.log(this.result);
      if(this.result.obj != '')
      {  
       
        this.dummy = this.result.obj;
        console.log("  hjgh "+ this.result.obj.id);
        
        this.boundsData = this.dummy.region.bounds;
        this.bounds = this.boundsData.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
        // //////console.log(this.bounds);
        this.coordinatesarr = this.bounds.split(" "); 
        // //////console.log(this.coordinatesarr); 
        this.courseGetImage(this.result.obj.id);
        
         
        //  this.zones();       
      } 
                
    })
  
    
   
  // **********************************    Getting InstallationId for restricted and work Zones  *****************

// this.zones();
    this.service.InsIdget().subscribe(data=>{
      //console.log(this.zoneValue);
  // //alert(this.zoneValue)
      
      //console.log(this.installation_Id);
      this.zoneValue = data['value']
      if(data['value'] == 1)
      {
 

        this.installation_Id = data['id'];
        this.zones();
      }
      else if(data['value'] == 2){
         this.installation_Id = data['id'];
        this.zones();
        // alert("workzones")
      }
      
    })
console.log(this.instId);

    
  }

// ********************************    Restricted And Work Zones Function    ****************************
  zones()
  {
    console.log(this.instId)
    this.sampleData = []
  console.log(this.result.obj.id);
  if(this.zoneValue == 1)
  {
    this.apollo.watchQuery({query : getZonesDetails,variables : {id : this.installation_Id}}).valueChanges.subscribe(({data,loading})=>{

    console.log("Zoness",data);
      //  this.zones = data['zones'];
        this.sampleData1 = data;
        this.sampleData = this.sampleData1.data.zonesWorkZones;
       console.log(this.sampleData);
        
      this.initilizeMap();
    });
  }
  else if(this.zoneValue == 2)
  {
    this.apollo.watchQuery({query : getWorkDetails,variables : {id : this.installation_Id}}).valueChanges.subscribe(({data,loading})=>{

      console.log("Zoness",data);
        //  this.zones = data['zones'];
        this.sampleData1 = data;
         this.sampleData = this.sampleData1.data.zonesWorkZones;
         console.log(this.sampleData);
          
        this.initilizeMap();
      });
  }
  }

  // *****************************************   Getting Course Image and Coordinates  ***************************
  courseGetImage(id:any)
  {
    
    
    this.apollo.watchQuery({query : courseImage,variables : {id : id}}).
    valueChanges.subscribe(({data,loading})=>{
      console.log(data);
      this.courseimageId1 = data;
      this.courseimageId = this.courseimageId1.data.installationContents
       this.instContFnvId = this.courseimageId[0].installationContentFnvId;
       console.log("   id  "+this.instContFnvId);
       this.service.getHoleImage(this.instContFnvId).subscribe(data=>{
        
         this.courseImageData = xml2json(data, { compact: true, spaces: 4 });
         this.courseImageData = JSON.parse(this.courseImageData);
         console.log(this.courseImageData);
         this.hashId = this.courseImageData.SmartDisplayInstallationManifest.Course.CourseAreaPicture._attributes.Hash;
         console.log(this.hashId);
         this.setHashId(this.hashId);
       })
    });

    
  }
  setHashId(value:any)
  {
    console.log("enter");
    
    this.service.getImage(value).subscribe(data=>{
      console.log(data);
     const blob = new Blob([data],{type : 'image/png'})
     this.imageUrl = URL.createObjectURL(blob);
      this.initilizeMap();
    })
  }

//   **********************************    Initialize Map   **************************************
priority : any =[]
  initilizeMap() {

    this.priority = []
    let coordinatearray=[];
    this.test = []
    var styleattr='';
    if(this.zoneValue == 1)
    {
      for(let i=0; i < this.sampleData.length; i++)
      {
        const result = this.sampleData[i].shape.split(',').map((s:any) =>s.replace(/[^\d., -]/g, '').trim().split(' '))  
        const prtype = this.sampleData[i].alertsPriority;
            if(result[0][0]=="")
            {
              console.log("if condition")
            }
            else
            {  
              this.test.push(result);
              //this.test.push({'result':result,'priority': prtype});
    // if(this.test[i] != undefined)
    //   coordinatearray.push(this.test[i].result);
    
              
              
            }  
    
       }
      //  this.styleFunction(this.priority)
           
    //  for(var k=0;k<this.test.length;k++){
    //   if(this.test[k].priority =="LOW")
    //     styleattr = 'rgba(255, 255, 71, 0.5)';
    //   else  if(this.test[k].priority =="NORMAL")
    //   styleattr = 'rgba(255, 99, 71, 0.4)'
    //   else  if(this.test[k].priority =="HIGH")
    //   styleattr = 'rgba(255,255,0,0.5)';

   
     
     this.geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:3857',
        },
      },
      features: [
        {
          type: 'Feature',
          // "properties" : {
          //   "Priority" : styleattr
          // },
          geometry: {
            type: 'Polygon',
            coordinates: 
                        this.test,
                      
          },
         // 'Priority' : this.test[k].priority
        //  style: new Style({
        //   fill: new Fill({
        //          color: styleattr
        //        }),
        //  })
       
         
         
          },
          
      ],
      
    
    };

    
//  }

                                  // this.styleFunction(this.geojsonObject.crs.properties.name,1)
     this.drawSource = new VectorSource({
                      features: new GeoJSON().readFeatures(this.geojsonObject),
                     });

                  
  }
  else if(this.zoneValue == 2)
  {
    for(let i=0; i < this.sampleData.length; i++)
    {
     

      const result = this.sampleData[i].shape.split(',').map((s:any) =>s.replace(/[^\d., -]/g, '').trim().split(' '));
      const prtype = this.sampleData[i].alertsPriority;
 
      if(result[0][0]=="")
      {
        console.log("if condition")
      }
      else
      { 
      
        this.test.push(result);
        
    //     this.test.push({'result':result,'priority': prtype});
    // if(this.test[i] != undefined)
    //   coordinatearray.push(this.test[i].result);
      }  
    }
    // for(var k=0;k<this.test.length;k++){
    //   if(this.test[k].priority =="LOW")
    //     styleattr = 'rgba(255, 255, 71, 0.5)';
    //   else  if(this.test[k].priority =="NORMAL")
    //   styleattr = 'rgba(255, 99, 71, 0.4)'
    //   else  if(this.test[k].priority =="HIGH")
    //   styleattr = 'rgba(255,255,0,0.5)';

   
     
     this.geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:3857',
        },
      },
      features: [
        {
          type: 'Feature',
          // "properties" : {
          //   "Priority" : styleattr
          // },
          geometry: {
            type: 'Polygon',
            coordinates: 
                        this.test,
                      
          },
         // 'Priority' : this.test[k].priority
        //  style: new Style({
        //   fill: new Fill({
        //          color: styleattr
        //        }),
        //  })
       
         
         
          },
          
      ],
      
    
    };

    
//  }
   this.drawSource = new VectorSource({
                     features: new GeoJSON().readFeatures(this.geojsonObject),
    });
  }


  const mystyle = [
  
    new Style({  
       fill: new Fill({ 
        color: 'rgba(255,255,255,0.5)'  
      }),  
    }),    
  ];

    const layer = new VectorLayer({
                                   source: this.drawSource,
                                   zIndex: 210,
                                   
                                   style : new Style({
                                        fill: new Fill({
                                                color: 'rgba(255, 255, 71, 0.3)'
                                              }),
                                       })
                                    
                                 });
   
   
  // --------------------   Bounds Data   ------------------ 
this.latitude1 = this.coordinatesarr[1];
this.longitude1 = this.coordinatesarr[2]
this.latitude2 =this.coordinatesarr[3]
this.longitude2 = this.coordinatesarr[4]
this.zoomLat = (parseFloat(this.latitude1) + parseFloat(this.latitude2))/2;
this.zoomLng = (parseFloat(this.longitude1) + parseFloat(this.longitude2))/2;
//  console.log(this.zoomLat,this.zoomLng);


    // -----------------------main Map starts------------------------
    
const view =  new View({ });

if(this.map)
    {
  
    this.map.setTarget('');
    this.map.removeLayer(layer)

    this.map= new Map({
                    view : new View({
                            center : [this.zoomLat,this.zoomLng],    
                            zoom: 16,
                            projection: 'EPSG:4326',
                         }),
   // --------------------- Layer Starts -----------------------
                    layers: [      
                               new TileLayer({
                              //  source: new BingMaps({
                              //  key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                              //  imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
                              //   }),
                              source: new XYZ({
                                url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',           
                             //attributions : 'abc'            
                              }),
                              }),
                               layer 
                             ], 
      
                               // --------------------- Layer End -----------------------
                               target: 'map',
                               keyboardEventTarget: document,    

                        });
      // navigator.geolocation.getCurrentPosition((pos)=>{
      //   this.map.getView().animate({
      //     center: [this.zoomLat, this.zoomLng],
      //     layers: [      
      //            new TileLayer({
      //             source: new BingMaps({
      //               key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
      //               imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
      //             }),
      //            }),
      //            layer
      //          ],                  
      //   })
      // })
      // view.animate(       
      //   {         
      //     center:  [this.zoomLat, this.zoomLng],

      //   },
      // );
    }
    
else
{
   this.map= new Map({
               view : new View({
               center : [this.zoomLat,this.zoomLng],    
               zoom: 16,
               projection: 'EPSG:4326',
             }),
                 // --------------------- Layer Starts -----------------------
               layers: [      
                        new TileLayer({
        
                          source: new XYZ({
                          url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',           
                       //attributions : 'abc'            
                        }),
                                        // source: new BingMaps({
                                        // key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                                        // imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
                                        // }),          
                                      }), 
      ], 
         
      // --------------------- Layer End -----------------------
      target: 'map',
      keyboardEventTarget: document,    
   
    });
  }  // -----------------------main Map Ends------------------------
 //  ************************   Static Image  Starts   *************************
  this.courseLngLat = this.courseImageData.SmartDisplayInstallationManifest.Course;
  const extent = [this.courseLngLat.CourseBottomLeft._attributes.Longitude,this.courseLngLat.CourseBottomLeft._attributes.Latitude,this.courseLngLat.CourseTopRight._attributes.Longitude,this.courseLngLat.CourseTopRight._attributes.Latitude]
  const projection = new Projection({
   code: 'xkcd-image',
   units: 'pixels',
   extent: extent,
 });

  this.staticImageLayer = new ImageLayer({
                            source: new Static({
                            attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
                            url: this.imageUrl,
                            projection: projection,
                            imageExtent: extent,
      
                            }), 
                                zIndex: 200,
});

    this.popup = new Overlay({
      element: this.popupCoordinates.nativeElement,
      positioning: OverlayPositioning.CENTER_CENTER,
    });


    this.map.on('click', (evt:any) => {
       this.clickedCordinates = evt.coordinate;
      
    });

    // *************************************     Zones styles   *******************************
 
const styles = [
  new Style({
    stroke: new Stroke({
      color: 'lightpink',
      width: 3,
    }),
    // fill: new Fill({
    //   color: 'rgba(255, 177, 177, 0.4)',
    // }),
   
  }),

];

 
const drawSource = new VectorSource();
    const drawLayer = new VectorLayer({
      source: drawSource,
      
    });

    if(this.clickMouse == 1)
    {
      ////console.log("enter");
      
     const drawInteraction = new Draw({
       source: drawSource,
       type: GeometryType.POLYGON,
       freehand: false,
     });
     this.map.addInteraction(drawInteraction);
    //  this.staticImageLayer.addInteraction(drawInteraction)
     drawInteraction.on('drawend', (e) => {
       this.popupCoordinates.nativeElement.style.display = 'block';
       const parser = new GeoJSON();
       const drawnFeatures = parser.writeFeaturesObject([e.feature]);
       ////////console.log('drawnFeatures', drawnFeatures.features);
       this.coordinatesArray = parser.writeFeatureObject(e.feature);
       ////////console.log(this.coordinatesArray.geometry.coordinates);
       this.popupCoordinates.nativeElement.innerHTML = this.coordinatesArray.geometry.coordinates;
       this.popup.setPosition(this.clickedCordinates);
 
     this.map.addOverlay(this.popup);
 
 
     setTimeout(()=>{   
       this.popupCoordinates.nativeElement.style.display = 'none';
   },700);
   });
 
 }

      this.map.addLayer(drawLayer)
      this.map.addLayer(this.staticImageLayer);
   

}
 styleFunction(feature:any,bounds:any){
   console.log(feature,bounds);
  //  this.stylepolygon.push(feature.crs.properties.name);
  //  console.log(this.stylepolygon);


   if(feature == undefined)
   {
      alert("undefined")
   }
   else
   {
   for(let i=0;i<feature.length; i++)
   {
 
      
     this.stylepolygon.push(feature[i])
  
    if (this.stylepolygon[i]==="LOW"){
     
      new Style({  
      fill: new Fill({ 
       color: 'rgba((255,0,0))'  
     }),  
   })    
    } else if  (this.stylepolygon[i]==="HIGH"){
      // alert("hifh")
      new Style({  
      fill: new Fill({ 
       color: 'rgba(255,255,255,0.5)'  
     }),  
   })   
    }
   
    
  
  }
}
}

zonesClick()
{
  console.log("enter");
  
}

}
