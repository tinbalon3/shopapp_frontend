import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/product-detail/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AppComponent } from './components/app/app.component';
import {  RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminComponent } from './components/admin/admin.component';

import { AdminModule } from './components/admin/admin.module';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { CheckoutSuccessfullComponent } from './components/checkout-successfull/checkout-successfull.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { VerifyEmailSuccessfullyComponent } from './components/verify-email-successfully/verify-email-successfully.component';
import { ReviewProductComponent } from './components/review-product/review-product.component';
import { ReviewProductRatingComponent } from './components/review-product-rating/review-product-rating.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { ThongbaoComponent } from './components/thongbao/thongbao.component';

const routes : Routes = [
  {path: 'loader', component: SkeletonLoaderComponent},
  {path: 'login', component: LoginComponent},
  {path: 'thongbao', component: ThongbaoComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'products/:id',component:DetailProductComponent},
  {path: 'user-profile',component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'admin',component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'orders',component: OrderComponent, canActivate: [AuthGuard]},
  {path: 'checkout-successfull/:order-trackingNumber',component: CheckoutSuccessfullComponent},
  {path: 'orders/:id',component: OrderDetailComponent, canActivate: [AuthGuard]},
  {path: 'checkout',component: CheckOutComponent, canActivate: [AuthGuard]},
  {path: '', component: HomeComponent, pathMatch: 'full' },
  {path: 'orders-history', component: OrderHistoryComponent},
  {path: 'verify-email', component: VerifyEmailComponent},
  {path: 'verify-success', component: VerifyEmailSuccessfullyComponent}
]
 
@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailProductComponent,
    OrderComponent,
    OrderDetailComponent,
    LoginComponent,
    RegisterComponent,
    AppComponent,
    UserProfileComponent,
    ConfirmDialogComponent,
    CategoryDialogComponent,
    OrderHistoryComponent,
    CartStatusComponent,
    CheckOutComponent,
    CheckoutSuccessfullComponent,
    VerifyEmailComponent,
    VerifyEmailSuccessfullyComponent,
    ReviewProductComponent,
    ReviewProductRatingComponent,
    ThongbaoComponent,
   

    
  ],
  imports: [
   
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgbModule,
    AdminModule,
    ToastrModule.forRoot() ,
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
   
  ],
  bootstrap: [
    
    AppComponent
  ]
})
export class AppModule { }
