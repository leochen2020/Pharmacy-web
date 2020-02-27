<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="16">
          <div class="grid-content logo" style="font-size: 24px;">
            <img src="../assets/05.png" style="width: 40px;" />
            Pharmacy Server
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="background-color: transparent; float: right; ">
              <el-menu-item index="1"><i class="el-icon-goods"></i>耗材中心</el-menu-item>
              <el-menu-item index="2"><i class="el-icon-setting"></i>设置</el-menu-item>
              <el-menu-item index="3">
                <router-link to='/'><i class="el-icon-back"></i>退出</router-link>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
      </el-row>

    </el-header>
    <el-main>
      <div style="width: 100%; text-align: right; margin-bottom: 15px;">
        颜色说明：
        <span>正常</span>
        <span class="d2">&nbsp;低于采购点&nbsp;</span>
        <span class="d1">&nbsp;低于最小库存&nbsp;</span>
        <span class="d3">&nbsp;即将过期（&lt;3天）&nbsp;</span>
      </div>

      <el-tabs >
        <el-tab-pane>
          <div slot="label" style="width: 200px; text-align: center;">所有</div>
          <div style="width: 100%; text-align: left;">

          <el-input placeholder="条形码" v-model="searchInput" class="input-with-select" style="width: 350px; margin-right: 15px;" clearable>
          </el-input>
          </div>
          <div v-if="showOneItem" class="" style="text-align: left; margin-top: 15px;">
            <el-tabs value="first">
                <el-tab-pane label="详细信息" name="first">
                  <el-form label-position="left" inline class="demo-table-expand oneItem">
                    <el-form-item label="名称">
                      <span>{{ oneItem.name }}</span>
                    </el-form-item>
                    <el-form-item label="ID">
                      <span>{{ oneItem.id }}</span>
                    </el-form-item>
                    <el-form-item label="条形码">
                      <span>{{ oneItem.code }}</span>
                    </el-form-item>
                    <el-form-item label="单位">
                      <span>{{ oneItem.unit }}</span>
                    </el-form-item>
                    <el-form-item label="库存">
                      <span>{{ oneItem.number }}</span>
                    </el-form-item>
                    <el-form-item label="最小库存">
                      <span>{{ oneItem.minNumber }}</span>
                    </el-form-item>
                    <el-form-item label="最大库存">
                      <span>{{ oneItem.maxNumber }}</span>
                    </el-form-item>
                    <el-form-item label="采购点">
                      <span>{{ oneItem.buyPoint }}</span>
                    </el-form-item>
                    <el-form-item label="建议采购量">
                      <span>{{ oneItem.maxNumber -  oneItem.number}}</span>
                    </el-form-item>
                    <el-form-item label="过期时间">
                      <span>{{ oneItem.overTime }}</span>
                    </el-form-item>
                    <el-form-item label="剩余">
                      <div style="width: 300px;">
                      <el-progress :text-inside="true" :stroke-width="26" :percentage="Math.trunc((oneItem.number / oneItem.maxNumber) * 100)"></el-progress>
                      </div>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-button-group>
                      <el-button @click="handleIn(-1, oneItem)">入库</el-button>
                      <el-button type="danger" @click="handleOut(-1, oneItem)">出库</el-button>
                      <el-button @click="handleEdit(-1, oneItem)">编辑</el-button>
                    </el-button-group>

                  </div>
                  <el-divider content-position="left">警告</el-divider>
                  <div style="font-size: 14px;">
                    <el-tag type="danger" v-if="oneItem.number <= oneItem.buyPoint">低于采购点</el-tag>
                    <el-tag type="danger" v-if="oneItem.number <= oneItem.minNum">低于最小库存</el-tag>
                    <el-tag type="danger" v-if="oneItem.over">即将过期</el-tag>
                  </div>

                </el-tab-pane>
                <el-tab-pane label="库存详细记录" name="second">
                  <el-table :data="oneItem.batch" stripe style="width: 100%;">
                    <el-table-column prop="id" label="批次" width="120">
                    </el-table-column>
                    <el-table-column prop="number" label="数目" width="120">
                    </el-table-column>
                    <el-table-column prop="inTime" label="入库时间" width="120">
                    </el-table-column>
                    <el-table-column prop="overTime" label="过期时间" width="120">
                    </el-table-column>
                    <el-table-column prop="user" label="入库人">
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="!showOneItem">
          <el-table :data="tableData" stripe style="width: 100%;" :row-class-name="tableRowClassName" >
            <el-table-column width="80" type="expand">
              <template slot-scope="props">
                <el-collapse accordion value="2">
                <el-collapse-item title="额外信息..." name="1">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="条形码">
                        <span>{{ props.row.code }}</span>
                      </el-form-item>
                      <el-form-item label="单位">
                        <span>{{ props.row.unit }}</span>
                      </el-form-item>
                      <el-form-item label="最大库存">
                        <span>{{ props.row.maxNumber }}</span>
                      </el-form-item>
                      <el-form-item label="建议采购量">
                        <span>{{ props.row.maxNumber -  props.row.number}}</span>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item title="库存详细记录" name="2">
                    <el-table :data="props.row.batch" stripe style="width: 100%;">
                      <el-table-column prop="id" label="批次" width="120">
                      </el-table-column>
                      <el-table-column prop="number" label="数目" width="120">
                      </el-table-column>
                      <el-table-column prop="inTime" label="入库时间" width="120">
                      </el-table-column>
                      <el-table-column prop="overTime" label="过期时间" width="120">
                      </el-table-column>
                      <el-table-column prop="user" label="入库人">
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>

            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120">
            </el-table-column>
            <el-table-column prop="number" label="库存" width="120">
            </el-table-column>
            <el-table-column prop="minNumber" label="最小库存" width="120">
            </el-table-column>
            <el-table-column prop="overTime" label="过期时间" width="120">
            </el-table-column>
            <el-table-column prop="buyPoint" label="采购点" width="120">
            </el-table-column>
            <el-table-column label="即将过期" width="120">
              <template slot-scope="scope">
                {{scope.row.over?'是':'否'}}
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button @click="handleIn(scope.$index, scope.row)">入库</el-button>
                  <el-button type="danger" @click="handleOut(scope.$index, scope.row)">出库</el-button>
                  <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="24" style="margin-top: 15px;">
            <el-col :span="8" style="text-align: left;">
              &nbsp;
            </el-col>
            <el-col :span="16" style="text-align: right;">
              <el-pagination layout="total, prev, pager, next, jumper" :total="tableDataSize" :current-page.sync="tablePage"
                style="text-align: right;">
              </el-pagination>
            </el-col>
          </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <div slot="label" class="navTab"><i class="el-icon-warning"></i> 低于最小库存
            <el-badge :value="minNum" class="item" type="danger" />
          </div>
          <div style="color: #FF0000; width: 100%; text-align: left; padding-left: 230px;">警告：列表项目低于最小库存，建议采购</div>
          <el-table :data="tableData2" stripe style="width: 100%;" :row-class-name="tableRowClassName2" >
            <el-table-column width="80" type="expand">
              <template slot-scope="props">
                <el-collapse accordion value="2">
                <el-collapse-item title="额外信息..." name="1">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="条形码">
                        <span>{{ props.row.code }}</span>
                      </el-form-item>
                      <el-form-item label="单位">
                        <span>{{ props.row.unit }}</span>
                      </el-form-item>
                      <el-form-item label="最大库存">
                        <span>{{ props.row.maxNumber }}</span>
                      </el-form-item>
                      <el-form-item label="建议采购量">
                        <span>{{ props.row.maxNumber -  props.row.number}}</span>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item title="库存详细记录" name="2">
                    <el-table :data="props.row.batch" stripe style="width: 100%;">
                      <el-table-column prop="id" label="批次" width="120">
                      </el-table-column>
                      <el-table-column prop="number" label="数目" width="120">
                      </el-table-column>
                      <el-table-column prop="inTime" label="入库时间" width="120">
                      </el-table-column>
                      <el-table-column prop="overTime" label="过期时间" width="120">
                      </el-table-column>
                      <el-table-column prop="user" label="入库人">
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>

            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120">
            </el-table-column>
            <el-table-column prop="number" label="库存" width="120">
            </el-table-column>
            <el-table-column prop="minNumber" label="最小库存" width="120">
            </el-table-column>
            <el-table-column prop="overTime" label="过期时间" width="120">
            </el-table-column>
            <el-table-column prop="buyPoint" label="采购点" width="120">
            </el-table-column>
            <el-table-column label="即将过期" width="120">
              <template slot-scope="scope">
                {{scope.row.over?'是':'否'}}
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button @click="handleIn(scope.$index, scope.row)">入库</el-button>
                  <el-button type="danger" @click="handleOut(scope.$index, scope.row)">出库</el-button>
                  <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane>
          <div slot="label" class="navTab"><i class="el-icon-warning"></i>
            低于采购点
            <el-badge :value="buyPointNum" class="item" type="danger" />
          </div>
          <div style="color: #FF0000; width: 100%; text-align: left; padding-left: 480px;">警告：列表项目低于采购点，建议采购</div>
            <el-table :data="tableData3" stripe style="width: 100%;" :row-class-name="tableRowClassName3" >
              <el-table-column width="80" type="expand">
                <template slot-scope="props">
                  <el-collapse accordion value="2">
                  <el-collapse-item title="额外信息..." name="1">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="条形码">
                          <span>{{ props.row.code }}</span>
                        </el-form-item>
                        <el-form-item label="单位">
                          <span>{{ props.row.unit }}</span>
                        </el-form-item>
                        <el-form-item label="最大库存">
                          <span>{{ props.row.maxNumber }}</span>
                        </el-form-item>
                        <el-form-item label="建议采购量">
                          <span>{{ props.row.maxNumber -  props.row.number}}</span>
                        </el-form-item>
                      </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="库存详细记录" name="2">
                      <el-table :data="props.row.batch" stripe style="width: 100%;">
                        <el-table-column prop="id" label="批次" width="120">
                        </el-table-column>
                        <el-table-column prop="number" label="数目" width="120">
                        </el-table-column>
                        <el-table-column prop="inTime" label="入库时间" width="120">
                        </el-table-column>
                        <el-table-column prop="overTime" label="过期时间" width="120">
                        </el-table-column>
                        <el-table-column prop="user" label="入库人">
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>

              <el-table-column prop="id" label="ID" width="80">
              </el-table-column>
              <el-table-column prop="name" label="名称" width="120">
              </el-table-column>
              <el-table-column prop="number" label="库存" width="120">
              </el-table-column>
              <el-table-column prop="minNumber" label="最小库存" width="120">
              </el-table-column>
              <el-table-column prop="overTime" label="过期时间" width="120">
              </el-table-column>
              <el-table-column prop="buyPoint" label="采购点" width="120">
              </el-table-column>
              <el-table-column label="即将过期" width="120">
                <template slot-scope="scope">
                  {{scope.row.over?'是':'否'}}
                </template>
              </el-table-column>
              <el-table-column label="">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button @click="handleIn(scope.$index, scope.row)">入库</el-button>
                    <el-button type="danger" @click="handleOut(scope.$index, scope.row)">出库</el-button>
                    <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane>
          <div slot="label" class="navTab"><i class="el-icon-warning"></i> 即将过期 (&lt;3天)
            <el-badge :value="overNum" class="item" type="danger" />
          </div>
          <div style="color: #FF0000; width: 100%; text-align: left; padding-left: 720px;">警告：列表项目即将过期，请注意使用</div>
          <el-table :data="tableData4" stripe style="width: 100%;" :row-class-name="tableRowClassName4" >
            <el-table-column width="80" type="expand">
              <template slot-scope="props">
                <el-collapse accordion value="2">
                <el-collapse-item title="额外信息..." name="1">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="条形码">
                        <span>{{ props.row.code }}</span>
                      </el-form-item>
                      <el-form-item label="单位">
                        <span>{{ props.row.unit }}</span>
                      </el-form-item>
                      <el-form-item label="最大库存">
                        <span>{{ props.row.maxNumber }}</span>
                      </el-form-item>
                      <el-form-item label="建议采购量">
                        <span>{{ props.row.maxNumber -  props.row.number}}</span>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item title="库存详细记录" name="2">
                    <el-table :data="props.row.batch" stripe style="width: 100%;">
                      <el-table-column prop="id" label="批次" width="120">
                      </el-table-column>
                      <el-table-column prop="number" label="数目" width="120">
                      </el-table-column>
                      <el-table-column prop="inTime" label="入库时间" width="120">
                      </el-table-column>
                      <el-table-column prop="overTime" label="过期时间" width="120">
                      </el-table-column>
                      <el-table-column prop="user" label="入库人">
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>

            <el-table-column prop="id" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120">
            </el-table-column>
            <el-table-column prop="number" label="库存" width="120">
            </el-table-column>
            <el-table-column prop="minNumber" label="最小库存" width="120">
            </el-table-column>
            <el-table-column prop="overTime" label="过期时间" width="120">
            </el-table-column>
            <el-table-column prop="buyPoint" label="采购点" width="120">
            </el-table-column>
            <el-table-column label="即将过期" width="120">
              <template slot-scope="scope">
                {{scope.row.over?'是':'否'}}
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button @click="handleIn(scope.$index, scope.row)">入库</el-button>
                  <el-button type="danger" @click="handleOut(scope.$index, scope.row)">出库</el-button>
                  <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <div class="footer1">
      <el-row :gutter="24" style="margin-top: 15px;">
        <el-col :span="24" style="text-align: left;">
          <div style="float: left; padding-top: 10px; margin-right: 15px;">
            <el-button @click="showAddItem" type="primary">新建</el-button>
            <el-button @click="loadTableData" type="primary">刷新</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="耗材" :visible.sync="dialogFormVisible">
      <div style="padding: 0px 50px; vertical-align: middle;">
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">名称</el-col>
          <el-col :span="16">
            <el-input v-model="form.name" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">条形码</el-col>
          <el-col :span="16">
            <el-input v-model="form.code" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">单位</el-col>
          <el-col :span="16">
            <el-input v-model="form.unit" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">最小库存</el-col>
          <el-col :span="16" style="text-align: left;">
            <el-input-number v-model="form.minNumber"/>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">最大库存</el-col>
          <el-col :span="16" style="text-align: left;">
            <el-input-number v-model="form.maxNumber"/>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">采购点</el-col>
          <el-col :span="16"  style="text-align: left;">
            <el-input-number v-model="form.buyPoint"/>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer" style="margin-top: 50px;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addItem">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="入库" :visible.sync="inVisible">
      <div style="padding: 0px 50px; vertical-align: middle;">
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">入库数目</el-col>
          <el-col :span="16">
            <el-slider v-model="inForm.number" align="right" show-input :max="inForm.max">
            </el-slider>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">过期日期 {{inForm.overTime}}</el-col>
          <el-col :span="16" style="text-align: left;">
            <el-date-picker v-model="inForm.overTime" value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
              :picker-options="inPickerOptions">
            </el-date-picker>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer" style="margin-top: 50px;">
          <el-button @click="inVisible = false">取 消</el-button>
          <el-button type="primary" @click="doIn">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="出库" :visible.sync="outVisible">
      <div style="padding: 0px 50px; vertical-align: middle;">

        <el-row :gutter="24" style="margin-top: 15px;">
          <el-col :span="8" class="dN">出库数目</el-col>
          <el-col :span="16">
            <el-slider v-model="outForm.number" align="right" show-input :max="outForm.max">
            </el-slider>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer" style="margin-top: 50px;">
          <el-button @click="outVisible = false">取 消</el-button>
          <el-button type="primary" @click="doOut">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      showOneItem: false,
      oneItem: {
        history: [],
        batch: []
      },
      activeIndex: '1',
      activeIndex2: '1',
      tableDataSize: 0,
      tableDataSize2: 0,
      tablePage: 1,
      tablePage2: 1,
      buyPointNum: 0,
      minNum: 0,
      overNum: 0,
      dialogFormVisible: false,
      searchInput: '',
      inVisible: false,
      outVisible: false,
      inRow: {},
      inForm: {
        itemId: 0,
        number: 0,
        overTime: '',
        max: 1000000,
        user: localStorage.getItem('token')
      },
      outForm: {
        itemId: 0,
        number: 0,
        user: localStorage.getItem('token')
      },
      inPickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '一个月',
          onClick (picker) {
            const date = new Date()
            date.setMonth(date.getMonth() + 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '3个月',
          onClick (picker) {
            const date = new Date()
            date.setMonth(date.getMonth() + 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '6个月',
          onClick (picker) {
            const date = new Date()
            date.setMonth(date.getMonth() + 6)
            picker.$emit('pick', date)
          }
        }, {
          text: '一年',
          onClick (picker) {
            const date = new Date()
            date.setMonth(date.getMonth() + 12)
            picker.$emit('pick', date)
          }
        }]
      },
      form: {
        id: '-1',
        name: '',
        buyPoint: '',
        code: '',
        minNumber: '',
        maxNumber: '',
        unit: '个'
      },
      tableAllData: [],
      tableData: [],
      tableData2: [],
      tableData3: [],
      tableData4: []
    }
  },
  created () {
    this.init = false
    this.loadTableData()
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    handleIn (index, row) {
      this.inRow = row
      this.inForm.itemId = row.id
      this.inForm.max = row.maxNumber - row.number
      this.inVisible = true
    },
    doIn () {
      let _this = this
      if (_this.inForm.overTime === '') {
        _this.showError('请选择过期时间')
        return
      }
      if (_this.inForm.number === 0) {
        _this.showError('入库数目必须大于0')
        return
      }

      _this.$ajax.get('/all/addItemBatch', {
        params: {
          ..._this.inForm
        }
      }).then(function (response) {
        let data = response.data
        if (data.code === 10) {
          _this.updateItemValue(data.data)
        } else {
          _this.showError(data.msg)
        }
      })
        .catch(function (error) {
          console.log(error)
          _this.showError('入库失败')
        })
      this.inVisible = false
    },
    updateItemValue (newItem) {
      for (var i in this.tableAllData) {
        var item = this.tableAllData[i]
        if (item.id === newItem.id) {
          this.copyItem(item, newItem)
          this.countWarn()
          break
        }
      }
      if (newItem.id === this.oneItem.id) {
        this.copyItem(this.oneItem, newItem)
      }
      this.countWarn()
    },
    copyItem (oldItem, newItem) {
      oldItem.id = newItem.id
      oldItem.name = newItem.name
      oldItem.number = newItem.number
      oldItem.minNumber = newItem.minNumber
      oldItem.maxNumber = newItem.maxNumber
      oldItem.buyPoint = newItem.buyPoint
      oldItem.unit = newItem.unit
      oldItem.code = newItem.code
      oldItem.overTime = newItem.overTime
      oldItem.over = newItem.over

      oldItem.batch.splice(0)
      for (let i in newItem.batch) {
        oldItem.batch.push(newItem.batch[i])
      }

      oldItem.history.splice(0)
      for (let i in newItem.history) {
        oldItem.history.push(newItem.history[i])
      }
    },
    handleOut (index, row) {
      this.outForm.itemId = row.id
      this.outForm.max = row.number
      this.outVisible = true
    },
    doOut () {
      let _this = this

      if (_this.outForm.number === 0) {
        _this.showError('出库数目必须大于0')
        return
      }
      _this.$ajax.get('/all/outItemBatch', {
        params: {
          ..._this.outForm
        }
      }).then(function (response) {
        let data = response.data
        if (data.code === 10) {
          _this.updateItemValue(data.data)
        } else {
          _this.showError(data.msg)
        }
      })
        .catch(function (error) {
          console.log(error)
          _this.showError('出库失败')
        })
      this.outVisible = false
    },
    handleEdit (index, row) {
      this.form.id = row.id
      this.form.name = row.name
      this.form.buyPoint = row.buyPoint
      this.form.code = row.code
      this.form.minNumber = row.minNumber
      this.form.maxNumber = row.maxNumber
      this.form.unit = row.unit

      this.dialogFormVisible = true
    },
    tableRowClassName ({
      row,
      rowIndex
    }) {
      var d = this.tableData[rowIndex]
      if (d.number <= d.minNumber) {
        return 'd1'
      } else if (d.over) {
        return 'd3'
      } else if (d.number <= d.buyPoint) {
        return 'd2'
      } else {
        return ''
      }
    },
    tableRowClassName2 ({
      row,
      rowIndex
    }) {
      return 'd1'
    },
    tableRowClassName3 ({
      row,
      rowIndex
    }) {
      return 'd2'
    },
    tableRowClassName4 ({
      row,
      rowIndex
    }) {
      return 'd3'
    },
    showError (msg) {
      this.$message({
        offset: 300,
        type: 'error',
        showClose: true,
        message: msg
      })
    },
    loadTableData () {
      console.info(this.$ajax)
      let _this = this
      if (!_this.$ajax) {
        setTimeout(function () {
          _this.loadTableData()
        }, 1000)
        return
      }
      _this.$ajax.get('/all/items').then(function (response) {
        let data = response.data
        if (data.code === 10) {
          _this.tableDataSize = data.data.length
          _this.tableAllData = data.data
          _this.countWarn()
        } else {
          _this.showError(data.msg)
        }
      }).then(function (response) {
        _this.initTable()
      })
        .catch(function (error) {
          console.log(error)
          _this.showError('载入数据失败')
        })
    },
    countWarn () {
      this.buyPointNum = 0
      this.overNum = 0
      this.minNum = 0

      this.tableData2.splice(0)
      this.tableData3.splice(0)
      this.tableData4.splice(0)
      for (var index in this.tableAllData) {
        var item = this.tableAllData[index]
        if (item.number <= item.buyPoint) {
          this.buyPointNum++
          this.tableData3.push(item)
        }

        if (item.number <= item.minNumber) {
          this.minNum++
          this.tableData2.push(item)
        }

        if (item.over) {
          this.overNum++
          this.tableData4.push(item)
        }
        // var dateStrs = item..split("-");
      }
    },
    initTable () {
      let _this = this
      _this.tableData.splice(0)
      for (let i = (_this.tablePage - 1) * 10; i < _this.tableAllData.length && i < _this.tablePage * 10; i++) {
        _this.tableData.push(_this.tableAllData[i])
      }
    },
    showAddItem () {
      this.dialogFormVisible = true
      this.form.id = -1
    },

    addItem () {
      let _this = this
      let isNew = this.form.id === -1
      if (_this.form.name === '') {
        _this.showError('请输入名称')
        return
      }
      if (_this.form.unit === '') {
        _this.showError('请输入单位')
        return
      }

      _this.$ajax.get('/all/item', {
        params: {
          ..._this.form
        }
      }).then(function (response) {
        console.log(response)
        console.log(response.data)
        let data = response.data
        if (data.code === 10) {
          if (isNew) {
            _this.tableAllData.push(data.data)
            _this.tableDataSize++
          } else {
            _this.updateItemValue(data.data)
          }

          _this.countWarn()
        } else {
          _this.showError(data.msg)
        }
      }).then(function (response) {
        _this.initTable()
      })
        .catch(function (error) {
          console.log(error)
          _this.showError('添加失败')
        })
      this.dialogFormVisible = false
    },
    daysBetween (DateOne, DateTwo) {
      var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'))
      var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1)
      var OneYear = DateOne.substring(0, DateOne.indexOf('-'))
      var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'))
      var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1)
      var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'))
      var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' +
          TwoYear)) / 86400000)
      return cha
    }

  },
  watch: {
    'tablePage': function (newVal) {
      this.initTable()
    },
    'searchInput': function (newVal) {
      if (newVal.length === 0) {
        this.showOneItem = false
        return
      }
      for (let i in this.tableAllData) {
        let item = this.tableAllData[i]
        if (item.code === newVal) {
          this.showOneItem = true
          this.copyItem(this.oneItem, item)
          return
        }
      }

      this.showOneItem = false
    }
  }
}
</script>
<style>
  .el-header,
  .el-footer {
    background-color: #FFFFFF;
    color: #333;
    text-align: left;
    line-height: 60px;
  }

  .el-header {
    border-bottom: #C0C0C0 solid 1px;
    padding-left: 15% !important;
    padding-right: 15% !important;
  }
  .el-collapse-item__header:hover {
    color: #409EFF;
  }
  .el-main {
    background-color: #FFFFFF;
    padding-left: 15% !important;
    padding-right: 15% !important;
    padding-bottom: 100px;
  }

  .footer1 {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    border-top: #C0C0C0 solid 1px;
    padding-left: 15% !important;
    padding-right: 15% !important;
    background-color: #FFFFFF;
  }
.navTab {
  width: 200px; text-align: center; padding-left: 40px;
}
  .logo {
    color: #409EFF;
  }

  .d1 {
    color: #ff0000;

  }

  .d2 {
    color: #409EFF;
  }

  .d3 {
    color: #E6A23C;
  }

  .dN {
    height: 40px;
    line-height: 40px;
  }

  .el-dialog__body {
    border-top: #cfcfcf solid 1px;
    margin-top: 15px;
  }

  .dialog-footer {}

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .oneItem .el-form-item {
    width: 50% !important;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
