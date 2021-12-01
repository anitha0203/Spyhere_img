import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import{HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private htttpOptions() {
  
    let httpOptions: any;
   
      return httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        })
    
    }
  }

  apiUrl = "https://vttapi.azaz.com/api/"
  private mapName = new BehaviorSubject<any>('dsg');
  private mapcoordinates = new BehaviorSubject({
    obj : ""
  })
  private mouseIcon = new BehaviorSubject<any>({
    obj : ""
  });

  private Course = new BehaviorSubject<any>({
    courseId : "ee97be63-0bae-47a0-8820-006ceaf99226"
  })

  private tourcart = new BehaviorSubject<any>({
    courseId : ""
  })
  private tagDetails = new BehaviorSubject<any>({
    obj: ""
  })
  private tagId = new BehaviorSubject<any>({
    tagId : ""
    })
  private toggle = new BehaviorSubject<any>(1);
  private userInstallations = new BehaviorSubject<any>({obj: ''})

  private zonesDetails = new BehaviorSubject<any>({obj : ''});
  private installationId = new BehaviorSubject<any>({instId:''});
  private insid = new BehaviorSubject<any>({obj : ""})
  private setinsid = new BehaviorSubject<any>({obj : ""})

  constructor(private http : HttpClient) {}
setToggleButton(value:any)
{
  this.toggle.next(value);
}

getToggleButton()
{
  return this.toggle.asObservable();
}

setInsId(value:any)
{
  this.insid.next(value);
}

getInsId()
{
  return this.insid.asObservable();
}

insIdSet(value:any)
{
  this.setinsid.next(value);
}

InsIdget()
{
  return this.setinsid.asObservable();
}


setUserInstallations(data: any){
  this.userInstallations.next(data);
}

getUserInstallations(){
  return this.userInstallations.asObservable();
}

setTagId(id:any)
{
this.tagId.next(id);
}
setInstallationId(instId: string){
  this.installationId.next(instId)
}
getInstallationId(){
 return this.installationId.asObservable();
}



getTagId()
{
return this.tagId.asObservable();
}
  setMapName(name:any) {
    this.mapName.next(name);
  }

  getMapName() {
    return this.mapName.asObservable();
  }

  setMapcoordinates(data : any)
  {
    //console.log(data);
    this.mapcoordinates.next(data)
  }

  setZonesDetails(data: any){
    console.log(data);
    
    this.zonesDetails.next(data);
  }
  getZonesDetails(){
    return this.zonesDetails.asObservable();
  }
 
  setTagDetails(data: any){
    this.tagDetails.next(data);
  }

  getTagDetails(){
    return this.tagDetails.asObservable();
  }
  getMapcoordinates()
  {
    return this.mapcoordinates.asObservable();
  }
  selectMouse(data : any)
  {
    //console.log(data);
    this.mouseIcon.next(data)
  }
 
  getMouseValue()
  {
    return this.mouseIcon.asObservable();
  }



  getGolfCourses()
  {
    return this.http.post(this.apiUrl + 'GetGolfCourses',this.htttpOptions());
  }


  setCourseId(id : any)
  {
    ////console.log(id)
    this.Course.next(id)
  }

  getCourseId()
  {
    return this.Course.asObservable();
  } 

  getTournamentDetails(obj:any)
  {
    return this.http.post(this.apiUrl + 'getTournaments',obj,this.htttpOptions());
  }

  getCourseCarts(obj:any)
  {
    return this.http.post(this.apiUrl + 'getCourseTags',obj,this.htttpOptions());
  }

  getCourseHoles(obj:any)
  {
    return this.http.post(this.apiUrl + 'getcourseHoles',obj,this.htttpOptions());

  }
  CUDTournament(obj:any)
  {
    return this.http.post(this.apiUrl + 'CUDTournament',obj,this.htttpOptions());
  } 
  saveRiderInfo(obj:any)
  {
//console.log(obj);
// const headers = { 'responseType': 'blob' as 'json'};

  return this.http.post(this.apiUrl + 'SaveTournamentDetails',obj,{responseType : 'text'});
    
  }

  getRiderInfo(obj1:any)

  {

    return this.http.post(this.apiUrl + 'gettournamentdetails',obj1,this.htttpOptions());

  }

  tournmtcartInformation(value:any)
  {
    //console.log(value);
    
    this.tourcart.next(value)
  }
  gettournmtcartInformation()
  {
    //console.log(this.tourcart);
    
    return this.tourcart.asObservable();
  }


  startTournament(obj:any)
  {
    return this.http.post(this.apiUrl + 'startTournament',obj,{responseType : 'text'})
  }

  endTournament(obj:any)
  {
    return this.http.post(this.apiUrl + 'endTournament',obj,{responseType : 'text'})
  }

  getImage(id:any){

    return  this.http.get('https://vtagapi.azaz.com/api/0/content/data/' +id,{responseType : 'blob'});

}

getHoleImage(id:any)

{

  return  this.http.get('https://vtagapi.azaz.com/api/0/content/data/' +id,{responseType : 'text'});

}


}
