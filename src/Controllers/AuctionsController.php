<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use PluginAuctions\Services\Database\AuctionsService;

    class AuctionsController extends Controller {

        /**
         * @var AuctionsService
         */
        private $auctionsService;

        /**
         * AuctionsController constructor.
         * @param AuctionsService $auctionsService
         */
        public function __construct(AuctionsService $auctionsService)
        {
            $this -> auctionsService = $auctionsService;
        }


        /**
         * @return array|bool
         */
        public function getAuctions()
        {
            return $this -> auctionsService -> getAuctions();
        }

        /**
         * @param int $auctionId
         * @return bool|mixed|string
         */
        public function getAuction($id)
        {
            return $id;
            if ($id && $id > 0)
            {
                json_encode($this -> auctionsService -> getAuction($id));
            }
            return 'keine ID (oder 0)';
        }

        /**
         * @param Request $request
         * @return string
         */
        public function createAuction(Request $request)
        {
            $newAuction = $request -> all();

            if ($newAuction)
            {
                if ($this -> auctionsService -> createAuction($newAuction))
                {
                    return 'ok';
                }
            }

            return 'Fehler beim Request';
        }

        /**
         * @param Request $request
         * @return \PluginAuctions\Services\Database\Auction[]
         */
        public function updateAuction(int $id, Request $request)
        {
            $auctionData = $request -> all();

            return $this -> auctionsService -> updateAuction($id, $auctionData);
        }

        /**
         * @param $auctionId
         * @return string
         */
        public function deleteAuction($id)
        {

            if ($id)
            {
                if ($this -> auctionsService -> deleteAuction($id))
                {
                    return 'ok, hier könnte aber noch etwas zurück kommen...';  //$this -> getAuctions();  // was soll wirklich zurück ???
                }

                return 'vom AuctionsService kam nichts';
            }

            return 'keine auctionId';
        }

    }