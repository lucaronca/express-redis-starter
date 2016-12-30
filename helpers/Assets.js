/* Asset class is useful to get the correct assets filtering
* it's a layer right after the webpack building process */

const path = require('path');

class Assets {

    constructor(req, viewName) {
        this.assetsList = req.app.get('assets');
        this.viewName = viewName;
    }

    filterByViewName() {

        let results = [];

        this.assetsList.forEach((asset) => {
            let testName = function(name) {
                // view name and other required assets
                return (name === 'commons' || name === 'vendor' || name === 'manifest' || name === this.viewName);
            }.bind(this);
            if (path.extname(asset.name) !== '.map' && asset.chunkNames.find(testName))
                results.push(asset.name);
        });

        return Promise.resolve(results);

    }

    filterByExt(list) {

        let result = {
            js: [],
            css: []
        };

        list.forEach((asset) => {
            result[path.extname(asset).replace('.', '')].push(asset);
        });

        return Promise.resolve(result);

    }

    customSetupFilter(list) {

        let index = list.findIndex((asset) => {

            /* remove commons.js asset
            is built default by webpack but is useless for us at the moment */
            return (path.extname(asset) === '.js' && asset.indexOf('commons') !== -1);

        });

        list.splice(index, 1);

        return Promise.resolve(list);

    }

    customSort(filteredObj) {

        Array.prototype.move = function(old_index, new_index) {
            if (new_index >= this.length) {
                let k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this; // for testing purposes
        };

        Array.prototype.sortByName = function(name, targetIndex) {
            this.map((asset, i, list) => {

                if (asset.indexOf(name) !== -1)
                    list.move(i, targetIndex);

            });
        };

        filteredObj.js.sortByName('manifest', 0);
        filteredObj.js.sortByName('vendor', 1);
        filteredObj.css.sortByName('commons', 0);

        return Promise.resolve(filteredObj);

    }

    filter() {

        return new Promise((resolve) => {
            this.filterByViewName()
                .then(this.customSetupFilter)
                .then(this.filterByExt)
                .then(this.customSort)
                .then((filteredObj) => {

                    resolve(filteredObj);

                });
        });

    }

}

module.exports = Assets;
