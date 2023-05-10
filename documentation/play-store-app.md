# Play store app

## Compilation

PWA is compiled to a publishable app using bubblewrap

https://developers.google.com/codelabs/pwa-in-play#1

### Bubblewrap log - Chronological

-   Install

```bash
# May require sudo
npm install -g @bubblewrap/cli
```

-   Init

```bash
bubblewrap init --manifest=https://localhost:43927/manifest.json
```

Got error

```console
Decompressing the Android SDK...
Initializing application from Web Manifest:
        -  https://localhost:43927/manifest.json


cli ERROR 00084386667F0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number:../deps/openssl/openssl/ssl/record/ssl3_record.c:355:
```

It seemingly has to do with the lack of https and may be solved by hosting the manifest on the main server

#### Attempting without https in url

```bash
bubblewrap init --manifest=http://localhost:43927/manifest.json
```

Not allowed. Must be https and not localhost

#### Attempting at https server

```bash
bubblewrap init --manifest=https://grid.hauptmann.tech/manifest.json
```

Config entered:

```
Domain: grid.hauptmann.tech
URL Path: /client

Application Name: grid-client
Short name: grid-client
Application ID: tech.hauptmann.grid.twa
Starting version code for new app version: 1
Display mode: standalone
Orientation: any
Status bar color: #FFFFFF

Splash screen color: #FFFFFF
Icon URL https://grid.hauptmann.tech/static/icons/grid-512.png
Maskable icon URL: https://grid.hauptmann.tech/static/icons/grid-512.png

Key store info: In password manager. Not shared.
```

Success

#### Attempting build

```bash
bubblewrap build
```

Got a store error, may have to redo without special characters? Seems odd

```error
cli ERROR Command failed: /home/bliztle/.bubblewrap/android_sdk/build-tools/33.0.2/apksigner sign --ks /home/bliztle/uni/semester-projects/p2/grid-all/grid-server/android.keystore --ks-key-alias android --ks-pass pass:WcW3y#9tDzc1Gpgw1g2GQ6MW6Eg#wT --key-pass pass:%MEpEs5b318WRcg1$E4Fpgqj@9p6Yh --out ./app-release-signed.apk ./app-release-unsigned-aligned.apk
Failed to load signer "signer #1"
java.io.IOException: Failed to obtain key with alias "android" from /home/bliztle/uni/semester-projects/p2/grid-all/grid-server/android.keystore. Wrong password?
        at com.android.apksigner.SignerParams.loadPrivateKeyAndCertsFromKeyStore(SignerParams.java:329)
        at com.android.apksigner.SignerParams.loadPrivateKeyAndCerts(SignerParams.java:181)
        at com.android.apksigner.ApkSignerTool.getSignerConfig(ApkSignerTool.java:419)
        at com.android.apksigner.ApkSignerTool.sign(ApkSignerTool.java:336)
        at com.android.apksigner.ApkSignerTool.main(ApkSignerTool.java:92)
Caused by: java.security.UnrecoverableKeyException: Get Key failed: Given final block not properly padded. Such issues can arise if a bad key is used during decryption.
        at java.base/sun.security.pkcs12.PKCS12KeyStore.engineGetKey(PKCS12KeyStore.java:465)
        at java.base/sun.security.util.KeyStoreDelegator.engineGetKey(KeyStoreDelegator.java:90)
        at java.base/java.security.KeyStore.getKey(KeyStore.java:1057)
        at com.android.apksigner.SignerParams.getKeyStoreKey(SignerParams.java:384)
        at com.android.apksigner.SignerParams.loadPrivateKeyAndCertsFromKeyStore(SignerParams.java:297)
        ... 4 more
Caused by: javax.crypto.BadPaddingException: Given final block not properly padded. Such issues can arise if a bad key is used during decryption.
        at java.base/com.sun.crypto.provider.CipherCore.unpad(CipherCore.java:975)
        at java.base/com.sun.crypto.provider.CipherCore.fillOutputBuffer(CipherCore.java:1056)
        at java.base/com.sun.crypto.provider.CipherCore.doFinal(CipherCore.java:853)
        at java.base/com.sun.crypto.provider.PKCS12PBECipherCore.implDoFinal(PKCS12PBECipherCore.java:408)
        at java.base/com.sun.crypto.provider.PKCS12PBECipherCore$PBEWithSHA1AndDESede.engineDoFinal(PKCS12PBECipherCore.java:440)
        at java.base/javax.crypto.Cipher.doFinal(Cipher.java:2202)
        at java.base/sun.security.pkcs12.PKCS12KeyStore.lambda$engineGetKey$0(PKCS12KeyStore.java:406)
        at java.base/sun.security.pkcs12.PKCS12KeyStore$RetryWithZero.run(PKCS12KeyStore.java:295)
        at java.base/sun.security.pkcs12.PKCS12KeyStore.engineGetKey(PKCS12KeyStore.java:400)
        ... 8 more
```
