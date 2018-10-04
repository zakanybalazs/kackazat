<template lang="html">
  <section>
    <div class="he">
      <h1>Részvények kockázatának kiszámítása</h1>
    </div>
    <div class="well">
      <h3>Adatok meghatározása</h3>
      <div class="row">
        <div class="col-lg-3 col-md-3">
          Vizsgált részvények száma
        </div>
        <div class="col-lg-3 col-md-3">
          <input class="in" type="number" v-model="reszvenyekSzama" min="2" step="1" style="width:60px">
        </div>
        <div class="col-lg-3 col-md-3">
          Vizsgált állapotok száma
        </div>
        <div class="col-lg-3 col-md-3">
          <input class="in" type="number" v-model="allapotokSzama" min="2" step="1" style="width:60px">
        </div>
        <div style="padding: 40px; text-align:right">
          <button class="btn btn-default" @click="_fillForm">Hozzáadás</button>
        </div>
      </div>
      <div>
        <h3>Részletezés</h3>
        <div class="box">
          <vue-scrolling-table
            :scroll-horizontal="true"
            :scroll-vertical="true"
            :sync-header-scroll="true"
            :class="{ freezeFirstColumn:true }"
          >
            <template slot="thead">
              <tr>
                <th class="w1" style="text-align:center">Név</th>
                <th class="w1" style="text-align:center">Bázis</th>
                <th class="w1" style="text-align:center" v-for="(allapot, index) in preCalc[0].allapotok" :key="index">{{index + 1}}. állapot</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(p,i) in preCalc" :key="i">
                <td class="w1">
                  <input type="text" v-model="preCalc[i].name">
                </td>
                <td class="w1">
                  <input type="number" v-model="preCalc[i].base">
                </td>
                <td class="w1" v-for="(allapot,_i) in preCalc[i].allapotok" :key="_i">
                  <input type="number" v-model="preCalc[i].allapotok[_i]">
                </td>
              </tr>
            </template>
          </vue-scrolling-table>
        </div>
      </div>
      <div>
        <p></p>
        <h3>Hozamráták</h3>
        <div class="box">
          <vue-scrolling-table
            :scroll-horizontal="true"
            :scroll-vertical="true"
            :sync-header-scroll="true"
            :class="{ freezeFirstColumn:true }"
          >
            <template slot="thead">
              <tr>
                <th class="w1" style="text-align:center">Név</th>
                <th class="w1" style="text-align:center" v-for="(allapot, index) in preCalc[0].allapotok" :key="index">{{index + 1}}. állapot</th>
                <th class="w1" style="text-align:center" >Várható hozam</th>
                <th class="w1" style="text-align:center" >Variancia</th>
                <th class="w1" style="text-align:center" >Szórás</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr>
                <td class="w1">
                  <input disabled value="Valószínűségek">
                </td>
                <td class="w1" v-for="(val,ind) in Valoszinusegek" :key="ind">
                  <input type="number" v-model="Valoszinusegek[ind]" min="0" max="1" step="0.0001">
                </td>
              </tr>
              <tr v-for="(p,i) in preCalc" :key="i">
                <td class="w1">
                  <input type="text" v-model="preCalc[i].name">
                </td>
                <td class="w1" v-for="(hozam,_i) in Hozamratak[i]" :key="_i">
                  <input type="number" :value="hozam">
                </td>
                <td class="w1">
                  <input type="text" :value="VarhatoHozamok[i]">
                </td>
                <td class="w1">
                  <input type="text" :value="Variancia[i]">
                </td>
                <td class="w1">
                  <input type="text" :value="Szoras[i]">
                </td>
              </tr>
            </template>
          </vue-scrolling-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="coffee">
  import VueScrollingTable from "vue-scrolling-table"
  export default
    components: {
      VueScrollingTable
    }
    data: -> {
      working: false
      reszvenyekSzama: 2
      allapotokSzama: 2
      Valoszinusegek: []
      preCalc: [{
        name: ''
        base: 0
        allapotok: []
      },{
        name: ''
        base: 0
        allapotok: []
      }]
    }
    computed:
      Hozamratak: () ->
        this.preCalc.map (tr, index) =>
          rowData = []
          for n in this.preCalc[index].allapotok
            rowData.push this._hozamrata(this.preCalc[index].base, n)
          return rowData
      VarhatoHozamok: () ->
        this.preCalc.map (tr, index) =>
          this._varhatohozam(index)
      Variancia: () ->
        this.preCalc.map (tr, index) =>
          this._vairancia(index)
      Szoras: () ->
        this.preCalc.map (tr, index) =>
          Math.sqrt this.Variancia[index]

    methods:
      _kovariancia: (index) ->

      _varhatohozam: (index) ->
        allapotok = this.preCalc[index].allapotok
        varhato = 0
        for i in [0..allapotok.length-1] by 1
          varhato += this.Hozamratak[index][i] * Number this.Valoszinusegek[i]
        return varhato
      _vairancia: (index) ->
        allapotok = this.preCalc[index].allapotok
        varhato_ertek = this.VarhatoHozamok[index]
        variancia = 0
        for i in [0..allapotok.length-1] by 1
          variancia += Math.pow((this.Hozamratak[index][i] - Number varhato_ertek), 2) * Number this.Valoszinusegek[i]
        return variancia
      _hozamrata: (base, n) ->
        return ((Number n - Number base) / Number base)
      _fillForm: () ->
        # set original values
        this.preCalc = [{
          name: ''
          base: 0
          allapotok: []
        },{
          name: ''
          base: 0
          allapotok: []
        }]
        if this.reszvenyekSzama > 2
          reszvenyekSzama = this.reszvenyekSzama
          for c in [3..reszvenyekSzama] by 1
            this.preCalc.push {
              name: ''
              base: 0
              allapotok: []
            }
        CALC = this.preCalc
        allapotokSzama = this.allapotokSzama
        for calc in CALC
          for x in [1..allapotokSzama] by 1
            calc.allapotok.push 0
        this.preCalc = CALC
        for x in [1..allapotokSzama] by 1
          this.Valoszinusegek.push 0
        this.$forceUpdate()

</script>

<style lang="css">
  .box {
    clear: both;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    width: 100%;
  }
  .btn {
    outline: none;
  }
  button:active {
    outline: none;
  }
  button:focus {
    outline: none;
  }
  button:hover {
    outline: none;
  }
  html {
    background-color: whitesmoke;
  }
  section {
    background-color: whitesmoke;
  }
  .he {
    text-align: center;
    padding: 30px;
    color: #35495e;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #35495e;
  }
  .well {
    max-width: 1200px;
    margin: 0 auto;
    padding:15px;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 15px;
  }
  .in {
    width: 100%;
    height: 40px;
    outline: none;
    border: 1px solid #35495e;
    border-radius: 5px;
    padding: 10px 5px 10px 5px;
  }



table {
  white-space: nowrap;
}
input {
  margin: 0px;
  width: 100%;
  height: 100%;
}
table.scrolling .w2 {
  height: 35px;
  width: 20em;
  padding: 0px;
  min-width: 25em;
  max-width: 25em;
}
table.scrolling .w1 {
  height: 35px;
  width: 15em;
  padding: 0px;
  min-width: 15em;
  max-width: 15em;
}
table.scrolling .wm {
  height: 35px;
  width: 10em;
  padding: 0px;
  min-width: 5em;
  max-width: 5em;
}
table.scrolling .wx {
  width: 20em;
  height: 35px;
  padding: 0px;
  min-width: 50em;
  max-width: 50em;
}
table.scrolling .w2m {
  height: 35px;
  width: 10em;
  padding: 0px;
  min-width: 10em;
  max-width: 10em;
}
table.scrolling tfoot tr th {
  width: 130em;
  min-width: 130em;
  max-width: 130em;
}
table.freezeFirstColumn thead tr,
table.freezeFirstColumn tbody tr {
  display: block;
  width: min-content;
}
table.freezeFirstColumn thead td:first-child,
table.freezeFirstColumn tbody td:first-child,
table.freezeFirstColumn thead th:first-child,
table.freezeFirstColumn tbody th:first-child {
  position: sticky;
  position: -webkit-sticky;
  left: 0;
}
* {
  font-family: sans-serif;
}
@font-face {
  font-family: FontAwesome;
  src: url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff);
}
.fa {
  font-family: FontAwesome;
}
</style>
