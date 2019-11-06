import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private commonService: CommonService,private spinner:NgxSpinnerService) { }
  girdDataObj: any = {};
  urlPercentage: any;
  hashTagPercentage: any;
  emojiPercentage: any;
  picsPercentage: any;
  topUrlObj = {};
  topHashTagObj = {};
  topEmojiObj = {};


  ngOnInit() {
    this.getDashboardList();
  }


  getDashboardList() {
    this.commonService.getDashboardDetails().subscribe(success => {
      this.girdDataObj = success;
      this.urlPercentage = this.girdDataObj['urls%'];
      this.hashTagPercentage = this.girdDataObj['hashtags%'];
      this.emojiPercentage = this.girdDataObj['emojis%'];
      this.picsPercentage = this.girdDataObj['pics%'];
      this.topUrlObj = this.girdDataObj['TopURL'];
      this.topHashTagObj = this.girdDataObj['TopHashTag'];
      this.topEmojiObj = this.girdDataObj['TopEmoji'];
    }, error => {

    })
  }


  roundOff(number: any) {

    return parseFloat(number).toFixed(4);

  }

}
