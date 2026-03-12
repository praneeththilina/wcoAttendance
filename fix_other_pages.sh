# Fix common catch error typings to error: any
sed -i 's/catch (error) {/catch (error: any) {/g' frontend/src/services/*.ts
sed -i 's/catch (err) {/catch (err: any) {/g' frontend/src/services/*.ts
sed -i 's/catch (e) {/catch (e: any) {/g' frontend/src/services/*.ts
