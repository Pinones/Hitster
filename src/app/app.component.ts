import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generatePdf } from './pdf-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('lists')
  lists: ElementRef | any;
  qrHeader: ElementRef | any;
  isLoading: boolean | undefined;
  title = 'hitster';
  dataList: any;
  getName: any = [];
  url: any = [];
  active: boolean | undefined;

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}
  ngOnInit(): void {}

  generate(id: string, name?: string) {
    const width = this.lists!.nativeElement.style.width;

    this.lists!.nativeElement.style.width = '700px';

    this.isLoading = true;
    generatePdf(id, name).then(
      (_) => (
        (this.lists!.nativeElement.style.width = width),
        (this.isLoading = false)
      )
    );
  }

  clipboard() {
    navigator.clipboard.readText().then((text) => {
      this.url = text.split('/')[4];
      console.log('i am url', this.url);
      if (this.url.length > 10) {
        this.snackBar.open('Link Valid!', '', { duration: 2000 });
        this.active = true;
        // console.log(this.dataList);

        this.dataList = this.url.items;
        // console.log(this.dataList);

        this.getList();
      } else {
        this.snackBar.open("You didn't add the correct spotify link!", '', {
          duration: 2000,
        });
        this.active = false;
      }
    });
  }

  getList() {
    this.http
      .get(`https://spotify23.p.rapidapi.com/playlist_tracks/?id=${this.url}`, {
        headers: {
          'X-RapidAPI-Key':
            'f88fc19374msh54306c0c02977e5p1153cfjsn34fe73034f30',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      })
      .subscribe((data) => {
        let getList = Object.values(data)[12];
        this.dataList = getList.items;
      });
  }
}
