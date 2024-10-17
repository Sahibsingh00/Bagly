import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, concatMap, map, mergeMap, shareReplay, switchMap, tap, toArray } from 'rxjs/operators';
import { Observable, forkJoin, from, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  public apiUrl: string;
  public newsLetteApi : string;
  public products: any;
  public authUrl: any;
  public cartUrl : any;
  public consumerKey: any = '';
  public consumerSecret: any = '';
  public cartData: any;
  private nonceObservable: Observable<string> | null = null;
  public addTocart = new EventEmitter();
  public loading = new EventEmitter();
  public stopLoading = new EventEmitter();
  public isLoggin = new EventEmitter();
  public refressSingleProduct = new EventEmitter();
  public refressCategoryPage = new EventEmitter();
  Listurl: string = "https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json";

  constructor(
    private http: HttpClient,
  ) {
    this.apiUrl = environment.APIURL;
    this.authUrl = environment.authurl;
    this.newsLetteApi = environment.NEWSLETTERAPI;
    this.consumerKey = environment.consumer_key;
    this.consumerSecret = environment.consumer_secret;
    this.cartUrl = environment.CAPIURL;
    this.loadCartFromStorage();
    this.initNonce();
  }


  createOrders(orderDetails: any) {
    return this.http.post(this.apiUrl + 'scalapay-order', orderDetails);
  }

  checkScalapayOrder(orderToken: string) {
    return this.http.get(`${this.apiUrl }check-scalapay-order?orderToken=${orderToken}`);
  }


/**
 * add to product emiter
 */
    addTocartProduct() {
      this.addTocart.emit();
    }
  
    refressProduct() {
      this.refressSingleProduct.emit();
    }
  
    refressCategory() {
      this.refressCategoryPage.emit();
    }

    
    loader() {
      this.loading.emit();
    }
  
    noLoader() {
      this.stopLoading.emit();
    }
  
    userLoggin() {
      this.isLoggin.emit();
    }


 /******************************************* Custom api Start **********************************************/


  contactMe(data : any) {
    return this.http.post<boolean>(this.apiUrl + 'contact/', data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getAllColors() {
    return this.http.get<Boolean>(this.apiUrl + 'color-attribute').pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getThemeOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}theme-options`);
  }

  getSingleProduct(slug: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'productdetail' + '/' + slug);
  }

  getAllProductsWithVariations(postsPerPage: number, page : any, category: string = '', color: string = '', sortBy: string = ''): Observable<any> {
    let params = new HttpParams()
        .set('posts_per_page', postsPerPage.toString())
        .set('page', page)
        .set('category', category)
      .set('color', color)
      .set('sort_by', sortBy);

    return this.http.get(this.apiUrl + 'allproducts', { params });
  }

  shopAllProductsWithVariations(postsPerPage: number, page : any, color: string = '', sortBy: string = ''): Observable<any> {
    let params = new HttpParams()
        .set('posts_per_page', postsPerPage.toString())
        .set('page', page)
        .set('color', color)
      .set('sort_by', sortBy);

    return this.http.get(this.apiUrl + 'shop-all-products', { params });
    }



    userSubscribe(email: any) {
      return this.http.post<Boolean>(this.newsLetteApi, email).pipe(
        map((list: any) => {
          return list;
        })
      );
    }



/******************************************* Custom API End **********************************************/


  


/******************************************** User Auth **********************************************/


  userLogin(data: any) {
    return this.http.post<Boolean>(this.authUrl, data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  userSignUp(data: any) {
    return this.http.post<Boolean>(this.apiUrl + 'signup', data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  checkCustomer(email: any) {
    return this.http.get<Boolean>(this.apiUrl + 'customers/?email=' + email).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getCustomer(id: any) {
    return this.http.get<Boolean>(this.apiUrl + 'customers/' + id).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  UpdateCustomer(id: any, data: any) {
    return this.http.put<Boolean>(this.apiUrl + 'customers/' + id, data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  CreateCustomer(data: any) {
    return this.http.post<Boolean>(this.apiUrl + 'customers', data).pipe(
      map((list: any) => {
        return list;
      }),
      catchError((error) => {
        // Handle the error and return an observable
        return throwError(error);
      })
    );
  }


/******************************************** User Auth End**********************************************/




/*********************************** Cart API's ***************************************************/

private initNonce() {
  this.nonceObservable = this.http.get<{ nonce: string }>('https://admin.bagly.it/wp-json/wc/v3/nonce').pipe(
    map(response => {
      if (!response.nonce) {
        throw new Error('Nonce not received from server');
      }
      return response.nonce;
    }),
    shareReplay(1),
    catchError(error => {
      console.error('Failed to fetch nonce:', error);
      return throwError(error);
    })
  );
}

private getRequestOptions(): Observable<{ headers: HttpHeaders }> {
  return this.nonceObservable!.pipe(
    map(nonce => ({
      headers: new HttpHeaders().set('Nonce', nonce)
    }))
  );
}

addSimpleProductToCart(productId: number, quantity: number): Observable<any> {
  return this.getRequestOptions().pipe(
    switchMap(options => {
      const line_items = { id: productId, quantity: quantity };
      return this.http.post<any>(this.cartUrl + 'add-item', line_items, options);
    }),
    catchError(error => this.handleNonceError(error, () => this.addSimpleProductToCart(productId, quantity)))
  );
}

removeItemFromCart(itemKey: string): Observable<any> {
  return this.getRequestOptions().pipe(
    switchMap(options => 
      this.http.post<any>(this.cartUrl + 'remove-item', { key: itemKey }, options)
    ),
    tap((response: any) => {
      this.saveCartToStorage(response);
    }),
    catchError(error => {
      if (error.status === 400 && error.error.message === 'Invalid cart item key') {
        return this.getCartFromServer().pipe(
          tap((serverCart: any) => {
            this.saveCartToStorage(serverCart);
          }),
          mergeMap(() => throwError('Cart refreshed. Please try removing the item again.'))
        );
      }
      return this.handleNonceError(error, () => this.removeItemFromCart(itemKey));
    })
  );
}

decreaseItemQuantity(itemKey: string, currentQuantity: number): Observable<any> {
  if (currentQuantity > 1) {
    return this.getRequestOptions().pipe(
      switchMap(options => 
        this.http.post<any>(this.cartUrl + 'update-item', 
          { key: itemKey, quantity: currentQuantity - 1 }, 
          options
        )
      ),
      catchError(error => this.handleNonceError(error, () => this.decreaseItemQuantity(itemKey, currentQuantity)))
    );
  } else {
    return this.removeItemFromCart(itemKey);
  }
}

getCartFromServer(): Observable<any> {
  return this.getRequestOptions().pipe(
    switchMap(options => this.http.get<any>(this.cartUrl, options)),
    catchError(error => this.handleNonceError(error, () => this.getCartFromServer()))
  );
}

private handleNonceError(error: any, retryCallback: () => Observable<any>): Observable<any> {
  if (error.status === 401 && error.error.code === 'woocommerce_rest_missing_nonce') {
    console.log('Nonce expired, refreshing...');
    this.initNonce(); // Refresh the nonce
    return retryCallback(); // Retry the original request
  }
  return throwError(error);
}











  removeAllCart() {
    this.cartData = {
      items: [],
      totals: {
        total_items: '0',
        total_price: '0',
      },
    };
    localStorage.removeItem('cart');
    
    return this.http.get<any>(this.cartUrl).pipe(
      switchMap((cart: any) => {
        if (!cart.items || cart.items.length === 0) {
          return of({ success: true, message: 'Cart is already empty' });
        }
  
        // Remove items sequentially to ensure each removal is processed
        return from(cart.items).pipe(
          concatMap((item: any) => this.removeItemFromCart(item.key)),
          toArray(),
          map(() => ({ success: true, message: 'All items removed from cart' }))
        );
      }),
      catchError((error) => {
        console.error('Error in removeAllItemsFromCart:', error);
        return of({ success: false, message: 'Failed to clear cart' });
      })
    );
  }



  loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartData = JSON.parse(cartData);
    } else {
      this.cartData = {
        items: [],
        totals: {
          total_items: '0',
          total_price: '0',
        },
      };
    }
  }

  saveCartToStorage(res : any) {
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(res));
  }



  /*************************************** Cart API's End****************************************************/

  allCountries(): Observable<any> {
    return this.http.get(this.Listurl);
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}data/countries`);
  }

  getStates(countryCode: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}data/countries/${countryCode}`);
  }

  getUsersOrder(id: number) {
    return this.http.get<Boolean>(this.apiUrl + 'orders?customer=' + id + '&customer_id=' + id).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getAllSearchProducts(product: string) {
    return this.http.get<Boolean>(this.apiUrl + 'products?search=' + product).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getallCategory() {
    return this.http.get<boolean>(this.apiUrl + 'products/categories').pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getModels() {
    return this.http.get<boolean>(this.apiUrl + 'models').pipe(
      map((list: any) => {
        return list;
      })
    );
  }




/********************************************Payment*******************************************/

  createOrder(data: any) {
    return this.http.post<boolean>(this.apiUrl + 'orders', data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  createNote(id: any, data : any) {
    return this.http.post<boolean>(this.apiUrl + 'orders/', id + '/notes', data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  updateOrder(id: any, data: any) {
    return this.http.put<boolean>(this.apiUrl + 'orders/' + id, data).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getOrdersDetail(id: any) {
    return this.http.get<boolean>(this.apiUrl + 'orders/' + id).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getShippingMethods(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'shipping-method').pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  getFacebookPixelId(){
    return this.http.get<any[]>(this.apiUrl + 'facebook-pixel').pipe(
      map((list: any) => {
        return list;
      })
    );
  }





}




