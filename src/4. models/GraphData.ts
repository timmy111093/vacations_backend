class GraphData{
      public destination:string;
      public followers:number;

      public constructor(graphData:GraphData){
            this.destination = graphData.destination;
            this.followers = graphData.followers;
      }
}

export default GraphData;