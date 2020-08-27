var app = new Vue({
    el: '#app',
    data: {
        stopsList: [],
        stop: undefined,
        searchQuery: '',
        stopId: '',
        stopName: '',
        stopTime: undefined,
        loading: false,
        currentItem: 0,
    },
    computed: {
        stopsResult: function(){
            if (this.searchQuery !== '') {
                this.stop = undefined
                this.currentItem = 0;
                return this.stopsList.filter((stop) => {
                    return stop.NumParada == this.searchQuery || 
                        stop.NombreParada.toLowerCase().match(this.searchQuery.toLowerCase())
                }).slice(0, 7);
            } 
        }
    },
    mounted () {
        this.stopSaved = JSON.parse(localStorage.getItem("Paradas"));
        axios
            .get('https://urbanosou.herokuapp.com/api/stops')
            .then(response => this.stopsList = response.data )
    },
    methods: {
        selectStop(id, name, sentido) {
            this.stop = undefined
            this.loading = true;
            this.stopName = name + ' - ' + sentido;
            this.searchQuery = this.stopName;
            axios
                .get('https://urbanosou.herokuapp.com/api/stops/'+id)
                .then(response => {
                    this.loading = false;
                    this.stop = response.data 
                });
        },
        nextItem () {
            if (event.keyCode === 38 && this.currentItem > 0) {
                this.currentItem--;
            } else if ((event.keyCode === 40 || event.keyCode === 9) && this.currentItem < this.stopsResult.length-1) {
                this.currentItem++;
            } else if (event.keyCode === 13) {
                this.selectStop(this.stopsResult[this.currentItem].NumParada,this.stopsResult[this.currentItem].NombreParada,this.stopsResult[this.currentItem].Sentido)
            }
        }
    }
})