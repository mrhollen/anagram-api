export class SortingService {
    public selectionSort(array: number[] | string[]): number[] | string[]{
        for(let i = 0; i < array.length; i++){
            let lowestIndex: number = i;
            for(let j = i; j < array.length; j++){
                if(array[j] < array[lowestIndex]){
                    lowestIndex = j;
                }
            }
            array = this.swap(array, i, lowestIndex);
        }

        return array;
    }

    public quickSort(array: number[] | string[]): number[] | string[] {
        // Cheat for now
        return array.sort();
    }

    private swap(array: any[], a: number, b: number): any[] {
        let tempItem = array[a];
        array[a] = array[b];
        array[b] = tempItem;
    
        return array;
    }
}