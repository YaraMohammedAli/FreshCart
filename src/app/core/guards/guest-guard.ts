import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORED_KEYS } from '../constant/storedKeys';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const plat_id = inject(PLATFORM_ID)

  if(isPlatformBrowser(plat_id)){
    const token = localStorage.getItem(STORED_KEYS.userToken);

    if( !token){
      return true;
    }else{
      return router.parseUrl('/home')

    }
  }
   return true
  
};
