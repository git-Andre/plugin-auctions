<?php


    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;


    class VisitorCounter_1 extends Model implements \JsonSerializable {

        const NAMESPACE = 'PluginAuctions\Models\VisitorCounter_1';

        public $id               = 0;
        public $updatedAt        = 0;
        public $itemId           = 0;
        public $numberOfVisitors = 0;

        /**
         * @return string
         */
        public function getTableName() : string
        {
            return 'PluginAuctions::VisitorCounter_1';
        }

        public function fillByAttributes($attributes)
        {
            foreach ($attributes as $attr => $val)
            {
                if (array_key_exists($attr, $this -> jsonSerialize()))
                {
                    $ref = &$this -> getVarRef($attr);
                    $ref = $val;
                }
            }
        }

        /**
         * Specify data which should be serialized to JSON
         * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed data which can be serialized by <b>json_encode</b>,
         * which is a value of any type other than a resource.
         * @since 5.4.0 (von IO::ItemWishList übernommen...)
         */
        function jsonSerialize()
        {
            return [
                'id'             => $this -> id,
                'updatedAt'      => $this -> updatedAt,
                'itemId'         => $this -> itemId,
                'visitorCounter' => $this -> visitorCounter,
            ];
        }

        private function &getVarRef($varName)
        {
            switch ($varName)
            {
                case 'id'               :
                    return $this -> id;
                case 'updatedAt'        :
                    return $this -> updatedAt;
                case 'itemId'        :
                    return $this -> itemId;
                case 'visitorCounter'        :
                    return $this -> visitorCounter;
            }
        }
    }