#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetModule, NSObject)

RCT_EXTERN_METHOD(updateWidget:(NSDictionary *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reloadWidget:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
