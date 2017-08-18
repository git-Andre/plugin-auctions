<?php
    /**
     * Created by PhpStorm.
     * User: andreoelschlaegel
     * Date: 30.07.17
     * Time: 19:52
     */


namespace PluginAuctions\Services\Database;

//use PluginAuctions\Models\Auction_4;
use PluginAuctions\Models\LiveAuction_53;
use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
use Plenty\Modules\Plugin\DataBase\Contracts\Model;

class DataBaseService
{
    /**
     * @var DataBase
     */
    public $dataBase;

    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
    }

    /**
     * @param Model $model
     * @return bool|Model
     */
    protected function setValue(Model $model)
    {
        if($model instanceof Model)
        {
            return $this->dataBase->save($model);
        }
        return false;
    }

    /**
     * Delete the give model from the database
     * @param $model
     * @return bool
     */
    public function deleteValue($model)
    {
        if($model instanceof Model)
        {
            return $this->dataBase->delete($model);
        }
        return false;
    }

    /**
     * Get the settings value
     *
     * @param string $modelClassName
     * @param mixed $key
     * @return bool|mixed
     */
    protected function getValue($modelClassName, $key)
    {
        $result = $this->dataBase->find($modelClassName, $key);

        if($result)
        {
            return $result;
        }
        return false;
    }

    /**
     * @param string $modelClassName
     * @return bool|array
     */
    protected function getValues($modelClassName, $fields=[], $values=[], $operator=['='])
    {
        $query = $this->dataBase->query($modelClassName);

        if( is_array($fields) && is_array($values) &&
            count($fields) > 0 && count($values) && count($values) == count($fields)
        )
        {
            foreach ($fields as $key => $field)
            {
                $query->where($field, array_key_exists($key,$operator)?$operator[$key]:'=', $values[$key]);
            }
        }

        $results = $query->get();

        if($results)
        {
            return $results;
        }
        return false;
    }
}